# ---- build stage ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy just the project file first so `dotnet restore` is cached
# separately from source changes.
COPY HabitTracker.Api.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

# ---- runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:4000
EXPOSE 4000

ENTRYPOINT ["dotnet", "HabitTracker.Api.dll"]
