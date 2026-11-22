package com.hkdn.backend.service;
import org.springframework.stereotype.Service;import java.nio.charset.StandardCharsets;import java.security.*;import java.util.HexFormat;
@Service public class HashService { public String sha256(byte[] data){try{byte[] digest=MessageDigest.getInstance("SHA-256").digest(data);return HexFormat.of().formatHex(digest);}catch(NoSuchAlgorithmException e){throw new IllegalStateException(e);}} public String sha256(String value){return sha256(value.getBytes(StandardCharsets.UTF_8));} }
