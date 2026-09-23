# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies first (layer caching)
COPY ["TaskTrack.API/TaskTrack.API.csproj", "TaskTrack.API/"]
COPY ["TaskTrack.Service/TaskTrack.Service.csproj", "TaskTrack.Service/"]
COPY ["TaskTrack.Repo/TaskTrack.Repo.csproj", "TaskTrack.Repo/"]

RUN dotnet restore "TaskTrack.API/TaskTrack.API.csproj"

# Copy all source code
COPY . .

# Build & publish
WORKDIR "/src/TaskTrack.API"
RUN dotnet publish "TaskTrack.API.csproj" -c Release -o /app/publish --no-restore

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user for security
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY --from=build /app/publish .

EXPOSE 10000

ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "TaskTrack.API.dll"]
