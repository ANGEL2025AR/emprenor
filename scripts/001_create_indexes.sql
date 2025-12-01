-- Script para crear índices en MongoDB
-- Ejecutar con: mongosh "MONGODB_URI" < scripts/001_create_indexes.sql

-- Este archivo es una referencia de los índices que se deben crear
-- Los índices se crean automáticamente cuando se ejecuta el script de inicialización

-- Índices para la colección users
-- db.users.createIndex({ email: 1 }, { unique: true });
-- db.users.createIndex({ role: 1 });
-- db.users.createIndex({ isActive: 1 });
-- db.users.createIndex({ companyId: 1 });

-- Índices para la colección projects
-- db.projects.createIndex({ code: 1 }, { unique: true });
-- db.projects.createIndex({ status: 1 });
-- db.projects.createIndex({ companyId: 1 });
-- db.projects.createIndex({ "team.managerId": 1 });
-- db.projects.createIndex({ "client.email": 1 });
-- db.projects.createIndex({ createdAt: -1 });

-- Índices para la colección tasks
-- db.tasks.createIndex({ projectId: 1 });
-- db.tasks.createIndex({ code: 1 }, { unique: true });
-- db.tasks.createIndex({ status: 1 });
-- db.tasks.createIndex({ assignedTo: 1 });
-- db.tasks.createIndex({ endDate: 1 });

-- Índices para la colección inspections
-- db.inspections.createIndex({ projectId: 1 });
-- db.inspections.createIndex({ code: 1 }, { unique: true });
-- db.inspections.createIndex({ result: 1 });
-- db.inspections.createIndex({ inspectorId: 1 });
-- db.inspections.createIndex({ date: -1 });

-- Índices para la colección transactions
-- db.transactions.createIndex({ projectId: 1 });
-- db.transactions.createIndex({ type: 1 });
-- db.transactions.createIndex({ status: 1 });
-- db.transactions.createIndex({ date: -1 });
-- db.transactions.createIndex({ dueDate: 1 });

-- Índices para la colección documents
-- db.documents.createIndex({ projectId: 1 });
-- db.documents.createIndex({ type: 1 });
-- db.documents.createIndex({ uploadedBy: 1 });
-- db.documents.createIndex({ createdAt: -1 });

-- Índices para la colección notifications
-- db.notifications.createIndex({ userId: 1 });
-- db.notifications.createIndex({ read: 1 });
-- db.notifications.createIndex({ createdAt: -1 });

-- Índices para la colección messages
-- db.messages.createIndex({ conversationId: 1 });
-- db.messages.createIndex({ senderId: 1 });
-- db.messages.createIndex({ createdAt: -1 });

-- Índices para la colección conversations
-- db.conversations.createIndex({ participants: 1 });
-- db.conversations.createIndex({ projectId: 1 });
-- db.conversations.createIndex({ updatedAt: -1 });

SELECT 'Índices documentados. Crear manualmente en MongoDB Atlas o ejecutar script JS.' as info;
