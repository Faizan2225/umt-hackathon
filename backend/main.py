from fastapi import FastAPI
from database.connection import init_db
from routes import auth_routes, job_routes, application_routes
from routes import websocket_routes, chat_routes



app = FastAPI(title="CampusConnect Backend")

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(auth_routes.router)
app.include_router(job_routes.router)
app.include_router(application_routes.router)
app.include_router(chat_routes.router)
app.include_router(websocket_routes.router)


@app.get("/")
def root():
    return {"message": "Welcome to CampusConnect API 🚀"}
