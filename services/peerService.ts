
import Peer, { DataConnection } from 'peerjs';

class PeerService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  
  private onConnectionChange: (connected: boolean, id?: string) => void = () => {};
  private onDataReceived: (data: any, peerId: string) => void = () => {};
  private onError: (err: string) => void = () => {};

  private reconnectInterval: any = null;
  private isDestroyed: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            this.destroy();
        });
    }
  }

  initialize(myId: string) {
    if (this.peer) {
        if (this.peer.id === myId && !this.peer.destroyed) return;
        this.destroy();
    }
    
    this.isDestroyed = false;

    try {
        this.peer = new Peer(myId, {
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' }
            ]
          }
        });
    
        this.peer.on('open', (id) => {
          if (this.reconnectInterval) {
             clearInterval(this.reconnectInterval);
             this.reconnectInterval = null;
          }
        });
    
        this.peer.on('connection', (conn) => {
          this.handleConnection(conn);
        });
    
        this.peer.on('error', (err) => {
          const errType = err.type as string;

          if (errType === 'unavailable-id' || errType === 'invalid-id') {
              this.onError('ID Unavailable or Invalid');
              return; 
          }
          
          if (errType === 'network' || errType === 'socket-error' || errType === 'server-error') {
              this.attemptReconnect();
          } else {
              this.onError(errType === 'peer-unavailable' ? 'Peer not found' : 'Connection error');
          }
        });
    
        this.peer.on('disconnected', () => {
           this.attemptReconnect();
        });
        
        this.peer.on('close', () => {
            if (!this.isDestroyed) {
                setTimeout(() => this.initialize(myId), 3000);
            }
        });
    } catch (e) {
        this.onError('Initialization Failed');
    }
  }
  
  private attemptReconnect() {
      if (this.isDestroyed || !this.peer) return;
      
      if (!this.peer.disconnected) return;

      this.peer.reconnect();
      
      if (!this.reconnectInterval) {
          this.reconnectInterval = setInterval(() => {
              if (this.peer && this.peer.disconnected && !this.isDestroyed) {
                  this.peer.reconnect();
              } else if (this.reconnectInterval) {
                  clearInterval(this.reconnectInterval);
                  this.reconnectInterval = null;
              }
          }, 5000);
      }
  }

  connect(remoteId: string) {
    if (!this.peer) return;
    
    if (this.peer.disconnected) {
        this.peer.reconnect();
    }

    if (this.connections.has(remoteId)) {
      const existingConn = this.connections.get(remoteId);
      if (existingConn && !existingConn.open) {
          this.connections.delete(remoteId);
      } else {
          return;
      }
    }

    const conn = this.peer.connect(remoteId, {
      reliable: true,
    });
    this.handleConnection(conn);
  }

  private handleConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      this.onConnectionChange(true, conn.peer);
      this.monitorConnection(conn);
    });

    conn.on('data', (data) => {
      this.onDataReceived(data, conn.peer);
    });

    conn.on('close', () => {
      this.handleClose(conn.peer);
    });

    conn.on('error', () => {
      this.onError(`Connection to ${conn.peer} lost`);
      this.handleClose(conn.peer);
    });
  }

  private monitorConnection(conn: DataConnection) {
    if (conn.peerConnection) {
      conn.peerConnection.oniceconnectionstatechange = () => {
        const state = conn.peerConnection.iceConnectionState;
        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
          this.handleClose(conn.peer);
        }
      };
    }
  }

  private handleClose(peerId: string) {
    if (this.connections.has(peerId)) {
      const conn = this.connections.get(peerId);
      conn?.close();
      this.connections.delete(peerId);
      this.onConnectionChange(false, peerId);
    }
  }

  sendToAll(data: any) {
    this.connections.forEach(conn => {
      if (conn.open) {
        conn.send(data);
      }
    });
  }

  sendTo(peerId: string, data: any) {
    const conn = this.connections.get(peerId);
    if (conn && conn.open) {
      conn.send(data);
    }
  }
  
  getBufferedAmount(peerId: string): number {
    const conn = this.connections.get(peerId);
    if (conn && conn.dataChannel) {
        return conn.dataChannel.bufferedAmount || 0;
    }
    return 0;
  }

  async waitForBuffer(peerId: string): Promise<void> {
    const conn = this.connections.get(peerId);
    if (!conn || !conn.open || !conn.dataChannel) return Promise.resolve();

    const channel = conn.dataChannel as any; // Cast to access RTCDataChannel properties directly
    
    // High watermark: 1MB. 
    // This allows for significantly higher throughput on fast networks by queuing more data.
    const MAX_BUFFER = 1024 * 1024; 

    if (channel.bufferedAmount < MAX_BUFFER) return Promise.resolve();

    return new Promise<void>((resolve) => {
        const onLow = () => {
            channel.removeEventListener('bufferedamountlow', onLow);
            resolve();
        };
        channel.addEventListener('bufferedamountlow', onLow);
        
        // Low watermark: 512KB.
        // Resume sending when the buffer is half empty. 
        // This ensures the pipe remains active and prevents "stop-and-wait" behavior.
        channel.bufferedAmountLowThreshold = 512 * 1024;
        
        // Safety check in case it drained while we were adding listeners
        if (channel.bufferedAmount < channel.bufferedAmountLowThreshold) {
            channel.removeEventListener('bufferedamountlow', onLow);
            resolve();
        }
    });
  }

  disconnectPeer(peerId: string) {
    this.handleClose(peerId);
  }

  setCallbacks(
    onConnectionChange: (connected: boolean, id?: string) => void,
    onDataReceived: (data: any, peerId: string) => void,
    onError: (err: string) => void
  ) {
    this.onConnectionChange = onConnectionChange;
    this.onDataReceived = onDataReceived;
    this.onError = onError;
  }

  destroy() {
    this.isDestroyed = true;
    if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
    }
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
    if (this.peer) {
      this.peer.destroy();
    }
    this.peer = null;
  }
  
  getConnectedPeers(): string[] {
    return Array.from(this.connections.keys());
  }
}

export const peerService = new PeerService();
