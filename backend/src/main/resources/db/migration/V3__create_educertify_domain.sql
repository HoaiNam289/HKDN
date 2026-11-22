CREATE TABLE certificates (
    id UUID PRIMARY KEY,
    code VARCHAR(80) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255),
    issuer_name VARCHAR(255) NOT NULL,
    issued_by UUID,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    content_hash VARCHAR(128),
    signature_id UUID,
    blockchain_tx_hash VARCHAR(128),
    issued_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revocation_reason VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_certificates_code UNIQUE (code),
    CONSTRAINT fk_certificates_issuer FOREIGN KEY (issued_by) REFERENCES users(id),
    CONSTRAINT ck_certificates_status CHECK (status IN ('DRAFT','PENDING_BLOCKCHAIN','ISSUED','REVOKED','FAILED'))
);

CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_recipient_email ON certificates(lower(recipient_email));
CREATE INDEX idx_certificates_issuer ON certificates(issued_by);

CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(120),
    owner_id UUID NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMPTZ,
    CONSTRAINT fk_materials_owner FOREIGN KEY (owner_id) REFERENCES users(id),
    CONSTRAINT ck_materials_status CHECK (status IN ('ACTIVE','ARCHIVED'))
);

CREATE INDEX idx_materials_owner ON materials(owner_id);
CREATE INDEX idx_materials_subject ON materials(lower(subject));

CREATE TABLE material_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    content_type VARCHAR(120) NOT NULL,
    file_size BIGINT NOT NULL,
    content_hash VARCHAR(128) NOT NULL,
    signature_id UUID,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_material_versions_material FOREIGN KEY (material_id) REFERENCES materials(id),
    CONSTRAINT fk_material_versions_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id),
    CONSTRAINT uq_material_versions_number UNIQUE (material_id, version_number),
    CONSTRAINT uq_material_versions_storage_key UNIQUE (storage_key)
);

CREATE INDEX idx_material_versions_hash ON material_versions(content_hash);

CREATE TABLE digital_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    algorithm VARCHAR(80) NOT NULL,
    key_id VARCHAR(255) NOT NULL,
    signer_id UUID NOT NULL,
    content_hash VARCHAR(128) NOT NULL,
    signature_value TEXT NOT NULL,
    public_key TEXT NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_signatures_signer FOREIGN KEY (signer_id) REFERENCES users(id)
);

CREATE INDEX idx_signatures_content_hash ON digital_signatures(content_hash);

CREATE TABLE blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID,
    content_hash VARCHAR(128) NOT NULL,
    network VARCHAR(100) NOT NULL,
    contract_address VARCHAR(128),
    transaction_hash VARCHAR(128),
    status VARCHAR(32) NOT NULL,
    error_message VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMPTZ,
    CONSTRAINT fk_blockchain_certificate FOREIGN KEY (certificate_id) REFERENCES certificates(id),
    CONSTRAINT ck_blockchain_status CHECK (status IN ('PENDING','CONFIRMED','FAILED','UNAVAILABLE'))
);

CREATE INDEX idx_blockchain_content_hash ON blockchain_transactions(content_hash);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);
