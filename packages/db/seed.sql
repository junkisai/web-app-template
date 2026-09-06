-- 何度流しても同じ状態になるよう、入れ直す前に消す
DELETE FROM users;

INSERT INTO users (id, name, created_at, updated_at)
VALUES (1, 'Alice', '2026-03-25T17:49:50.847Z', '2026-03-25 18:57:39');
