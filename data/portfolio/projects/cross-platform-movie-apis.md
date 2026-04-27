# Cross-Platform Movie APIs

## Summary
Parallel GraphQL and REST API implementations built in C# .NET Minimal API and Node.js, backed by a shared PostgreSQL data layer for consistent business logic and performance.

## Problem
Full-stack applications often need to evaluate API design tradeoffs across platforms while preserving consistent data behavior, validation, search, filtering, and pagination.

## Responsibilities
- Designed and built the C# .NET Minimal API implementation
- Designed and built the Node.js and TypeScript API implementation
- Implemented GraphQL and REST endpoints across both platforms
- Modeled shared PostgreSQL repository patterns
- Added production-ready API behavior and operational safeguards

## Technical Details
- C# and ASP.NET Core Minimal API
- Node.js and TypeScript
- GraphQL with Hot Chocolate and GraphQL Yoga
- REST APIs
- PostgreSQL
- Dapper
- Shared stored functions
- Swagger / OpenAPI
- Validation
- Logging
- CORS
- Centralized error handling

## Notable Work
- Implemented GraphQL queries and mutations for search, filtering, pagination, and partial updates.
- Reused PostgreSQL stored functions across C# and Node.js platforms through repository patterns.
- Added Swagger / OpenAPI documentation and validation for REST consumers.
- Centralized error handling and logging to support production readiness.

## Outcomes
- Enabled comparison of C# and Node.js API implementation patterns.
- Kept business logic consistent through shared PostgreSQL functions.
- Supported scalable filtering, pagination, and partial update workflows.

## Technologies
- C#
- ASP.NET Core
- Node.js
- TypeScript
- GraphQL
- PostgreSQL
- Dapper
- Swagger / OpenAPI
