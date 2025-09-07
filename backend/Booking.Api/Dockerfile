# Use the official .NET runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Use the .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution file and project files for dependency restore
COPY booking.sln .
COPY Booking.Api/Booking.Api.csproj Booking.Api/
COPY Booking.Application/Booking.Application.csproj Booking.Application/
COPY Booking.Domain/Booking.Domain.csproj Booking.Domain/
COPY Booking.Infrastructure/Booking.Infrastructure.csproj Booking.Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Build the application
WORKDIR /src/Booking.Api
RUN dotnet build -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Build runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Copy database scripts to the Data directory
COPY --from=build /src/Booking.Infrastructure/Data/Scripts ./Data/Scripts

ENTRYPOINT ["dotnet", "Booking.Api.dll"]