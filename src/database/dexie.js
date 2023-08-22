import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(2).stores({
  conversations: '++id, keyConversation, uuidMessage', // Primary key and indexed props
});

