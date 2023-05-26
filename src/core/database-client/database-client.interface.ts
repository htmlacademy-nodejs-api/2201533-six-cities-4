import {ConnectionType} from '../../types/connection.type.js';

export interface DatabaseClientInterface {
  connect(uri: ConnectionType): Promise<void>;
  disconnect(): Promise<void>;
}
