package com.hkdn.backend.service;
import java.util.Optional;
public interface BlockchainGateway { Optional<String> recordHash(String contentHash); Optional<Boolean> hasHash(String contentHash); Optional<String> revoke(String contentHash); boolean available(); }
