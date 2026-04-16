import { Module } from "../types";

export const module7: Module = {
  id: "grpc-protobuf",
  title: "gRPC, Protocol Buffers & Microservices",
  description: "Define services with Protocol Buffers, generate Go code, build gRPC servers and clients, streaming RPCs, and inter-service communication patterns",
  lessons: [
    {
      id: "grpc-protobuf",
      slug: "grpc-protobuf",
      title: "gRPC & Protocol Buffers",
      content: `# gRPC & Protocol Buffers

gRPC is Go's native RPC framework — binary-efficient, strongly typed, and supports streaming. Used by Kubernetes, etcd, and most large-scale Go microservices.

---

\`\`\`concept
{
  "title": "Why gRPC over REST?",
  "variant": "mental-model",
  "content": "REST uses JSON over HTTP/1.1 — human readable, but text encoding is slow and there's no built-in schema. gRPC uses Protocol Buffers (binary) over HTTP/2 — 3-10x faster serialization, strict schema enforced at compile time, auto-generated clients in 10+ languages, and first-class streaming. Trade-off: not human-readable, needs tooling to debug. Rule of thumb: REST for public APIs (browser-friendly), gRPC for internal microservice calls."
}
\`\`\`

---

## Define the Service (.proto file)

\`\`\`protobuf
// proto/user.proto
syntax = "proto3";
package user;

option go_package = "github.com/yourorg/app/gen/user";

// Message types:
message User {
    string id    = 1;
    string name  = 2;
    string email = 3;
    int64  created_at = 4;
}

message GetUserRequest {
    string id = 1;
}

message ListUsersRequest {
    int32 page      = 1;
    int32 page_size = 2;
}

message ListUsersResponse {
    repeated User users     = 1;
    int32         total     = 2;
    bool          has_more  = 3;
}

message CreateUserRequest {
    string name  = 1;
    string email = 2;
}

// Service definition:
service UserService {
    // Unary RPC — request/response like HTTP:
    rpc GetUser(GetUserRequest) returns (User);
    rpc CreateUser(CreateUserRequest) returns (User);
    rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);

    // Server streaming — server sends stream, client reads:
    rpc WatchUsers(ListUsersRequest) returns (stream User);

    // Client streaming — client sends stream, server responds once:
    rpc BulkCreateUsers(stream CreateUserRequest) returns (ListUsersResponse);

    // Bidirectional streaming:
    rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}
\`\`\`

## Generate Go Code

\`\`\`bash
# Install protoc compiler and Go plugins:
# brew install protobuf
# go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
# go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Generate Go code from .proto:
protoc \\
  --go_out=gen --go_opt=paths=source_relative \\
  --go-grpc_out=gen --go-grpc_opt=paths=source_relative \\
  proto/user.proto

# This generates:
# gen/user/user.pb.go        — message types
# gen/user/user_grpc.pb.go   — server/client interfaces

# In go.mod:
# require google.golang.org/grpc v1.60.0
# require google.golang.org/protobuf v1.31.0
\`\`\`

## Implement the gRPC Server

\`\`\`go
package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"

    pb "github.com/yourorg/app/gen/user"
)

// Server struct embeds the UnimplementedUserServiceServer for forward compatibility:
type userServer struct {
    pb.UnimplementedUserServiceServer
    db UserRepository
}

// Unary RPC:
func (s *userServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
    if req.Id == "" {
        return nil, status.Error(codes.InvalidArgument, "id is required")
    }

    user, err := s.db.FindByID(ctx, req.Id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, status.Errorf(codes.NotFound, "user %s not found", req.Id)
        }
        return nil, status.Errorf(codes.Internal, "database error: %v", err)
    }

    return &pb.User{
        Id:        user.ID,
        Name:      user.Name,
        Email:     user.Email,
        CreatedAt: user.CreatedAt.Unix(),
    }, nil
}

// Server-streaming RPC:
func (s *userServer) WatchUsers(req *pb.ListUsersRequest, stream pb.UserService_WatchUsersServer) error {
    ctx := stream.Context()
    users, _ := s.db.List(ctx, int(req.PageSize))

    for _, u := range users {
        select {
        case <-ctx.Done():
            return status.Error(codes.Canceled, "client disconnected")
        default:
        }
        if err := stream.Send(&pb.User{Id: u.ID, Name: u.Name}); err != nil {
            return err
        }
    }
    return nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("listen: %v", err)
    }

    // Interceptors (middleware):
    s := grpc.NewServer(
        grpc.UnaryInterceptor(loggingInterceptor),
        grpc.StreamInterceptor(streamLoggingInterceptor),
    )
    pb.RegisterUserServiceServer(s, &userServer{db: NewPostgresRepo()})

    log.Printf("gRPC server listening on :50051")
    if err := s.Serve(lis); err != nil {
        log.Fatalf("serve: %v", err)
    }
}
\`\`\`

## gRPC Client

\`\`\`go
package main

import (
    "context"
    "io"
    "log"
    "time"

    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"

    pb "github.com/yourorg/app/gen/user"
)

func main() {
    // Connect (insecure for dev, use TLS in production):
    conn, err := grpc.Dial("localhost:50051",
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithBlock(),
    )
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    client := pb.NewUserServiceClient(conn)

    // Unary call with timeout:
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    user, err := client.GetUser(ctx, &pb.GetUserRequest{Id: "123"})
    if err != nil {
        // Extract gRPC status code:
        st, _ := status.FromError(err)
        log.Printf("error %v: %s", st.Code(), st.Message())
        return
    }
    log.Printf("Got user: %s", user.Name)

    // Consume server stream:
    stream, err := client.WatchUsers(ctx, &pb.ListUsersRequest{PageSize: 10})
    if err != nil {
        log.Fatal(err)
    }
    for {
        u, err := stream.Recv()
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Printf("stream error: %v", err)
            break
        }
        log.Printf("Received: %s", u.Name)
    }
}
\`\`\`

## Interceptors (Middleware)

\`\`\`go
// Unary interceptor — logging + timing:
func loggingInterceptor(
    ctx context.Context,
    req interface{},
    info *grpc.UnaryServerInfo,
    handler grpc.UnaryHandler,
) (interface{}, error) {
    start := time.Now()
    resp, err := handler(ctx, req)
    log.Printf("method=%s duration=%v err=%v", info.FullMethod, time.Since(start), err)
    return resp, err
}

// Auth interceptor — check JWT in metadata:
func authInterceptor(
    ctx context.Context,
    req interface{},
    info *grpc.UnaryServerInfo,
    handler grpc.UnaryHandler,
) (interface{}, error) {
    md, ok := metadata.FromIncomingContext(ctx)
    if !ok {
        return nil, status.Error(codes.Unauthenticated, "missing metadata")
    }

    tokens := md.Get("authorization")
    if len(tokens) == 0 || !validateJWT(tokens[0]) {
        return nil, status.Error(codes.Unauthenticated, "invalid token")
    }

    return handler(ctx, req)
}

// Chain multiple interceptors with grpc_middleware:
// grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
//   authInterceptor,
//   loggingInterceptor,
//   rateLimitInterceptor,
// ))
\`\`\`

\`\`\`compare
{
  "title": "gRPC RPC Types",
  "items": [
    {
      "name": "Unary RPC",
      "description": "Client sends one request, server returns one response. Equivalent to a regular function call. Use for: most CRUD operations, queries that fit in memory."
    },
    {
      "name": "Server Streaming",
      "description": "Client sends one request, server streams multiple responses. Use for: real-time feeds, large result sets (send as they're ready), file downloads."
    },
    {
      "name": "Client Streaming",
      "description": "Client streams multiple requests, server responds once. Use for: bulk uploads, aggregated analytics, log ingestion."
    },
    {
      "name": "Bidirectional Streaming",
      "description": "Both sides stream independently over one connection. Use for: chat, collaborative editing, real-time games, telemetry."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Embed UnimplementedXxxServer in your server struct — future proto additions won't break your server at compile time.", "gRPC status codes replace HTTP status codes: codes.NotFound (404), codes.InvalidArgument (400), codes.Internal (500).", "Always pass context to gRPC calls — cancellation propagates through the entire call chain.", "Interceptors are gRPC middleware — chain them for auth, logging, rate limiting, and metrics.", "Use TLS in production: grpc.WithTransportCredentials(credentials.NewTLS(tlsConf)) on the client.", "proto3 field numbers (= 1, = 2) are permanent — never reuse a field number, only deprecate fields."]
\`\`\`
`,
    },
  ],
};
