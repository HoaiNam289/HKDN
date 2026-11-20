INSERT INTO roles (code, name)
VALUES
    ('ADMIN', 'Quản trị viên'),
    ('ISSUER', 'Đơn vị phát hành'),
    ('STUDENT', 'Sinh viên')
ON CONFLICT (code) DO NOTHING;
