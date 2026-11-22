package com.hkdn.backend.controller;

import com.hkdn.backend.exception.*;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;
import org.springframework.dao.DataIntegrityViolationException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<Map<String,Object>> notFound(ResourceNotFoundException e){return body(HttpStatus.NOT_FOUND,e.getMessage());}
    @ExceptionHandler(ConflictException.class) ResponseEntity<Map<String,Object>> conflict(ConflictException e){return body(HttpStatus.CONFLICT,e.getMessage());}
    @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<Map<String,Object>> integrity(){return body(HttpStatus.CONFLICT,"The submitted data conflicts with an existing record");}
    @ExceptionHandler(BusinessException.class) ResponseEntity<Map<String,Object>> business(BusinessException e){return body(HttpStatus.UNPROCESSABLE_CONTENT,e.getMessage());}
    @ExceptionHandler(AccessDeniedException.class) ResponseEntity<Map<String,Object>> denied(){return body(HttpStatus.FORBIDDEN,"Insufficient permissions");}
    @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<Map<String,Object>> invalid(MethodArgumentNotValidException e){Map<String,String> fields=new LinkedHashMap<>();e.getBindingResult().getFieldErrors().forEach(x->fields.put(x.getField(),x.getDefaultMessage()));return ResponseEntity.badRequest().body(Map.of("timestamp",Instant.now(),"status",400,"error","Validation failed","fields",fields));}
    @ExceptionHandler(ConstraintViolationException.class) ResponseEntity<Map<String,Object>> violation(ConstraintViolationException e){return body(HttpStatus.BAD_REQUEST,e.getMessage());}
    @ExceptionHandler(Exception.class) ResponseEntity<Map<String,Object>> unexpected(){return body(HttpStatus.INTERNAL_SERVER_ERROR,"Unexpected server error");}
    private ResponseEntity<Map<String,Object>> body(HttpStatus status,String message){return ResponseEntity.status(status).body(Map.of("timestamp",Instant.now(),"status",status.value(),"error",message==null?status.getReasonPhrase():message));}
}
