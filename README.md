# delivery-tracking-system-47734-47744

Delivery Tracker Backend (Express)
- Port: 3001 by default (configurable with PORT env var)
- Docs: /docs (Swagger UI)

How to run
1) cd delivery_tracker_backend
2) npm install
3) npm run dev  # starts with nodemon on PORT=3001 by default
   OR
   npm start     # production start

Environment variables
- PORT (optional, default 3001)
- HOST (optional, default 0.0.0.0)

Sample curl
- Health:
  curl -s http://localhost:3001/

- Seed:
  curl -X POST http://localhost:3001/seed

- Create delivery:
  curl -X POST http://localhost:3001/deliveries \
    -H "Content-Type: application/json" \
    -d '{"sender":"Alice","recipient":"Bob","address":"123 Main St","packageDetails":{"weightKg":1.2},"expectedDeliveryDate":"2025-12-31T12:00:00.000Z"}'

- List deliveries (filters and pagination):
  curl "http://localhost:3001/deliveries?status=created,in_transit&page=1&pageSize=5"

- Get delivery by id:
  curl "http://localhost:3001/deliveries/REPLACE_ID"

- Update status:
  curl -X PATCH "http://localhost:3001/deliveries/REPLACE_ID/status" \
    -H "Content-Type: application/json" \
    -d '{"status":"in_transit","note":"Left hub"}'

- History:
  curl "http://localhost:3001/deliveries/REPLACE_ID/history"