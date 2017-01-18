import Vapor
import FluentMongo
import Turnstile
import HTTP
import Auth
import Turnstile
import TurnstileCrypto
import TurnstileWeb

let drop = Droplet()

let mongo = try MongoDriver(
    database: drop.config["db", "database"]!.string!,
    user: drop.config["db", "username"]!.string!,
    password: drop.config["db", "password"]!.string!,
    host: drop.config["db", "host"]!.string!,
    port: drop.config["db", "port"]!.int!
)
let db = Database(mongo)

drop.database = db

drop.preparations.append(Scholar.self)

drop.get { request in
    let scholars = try Scholar.query().filter("status", "accepted").all()
    
    var dashboardView = try Node(node: [
        "pagename": "Dashboard",
        "baseURL": request.baseURL,
        "scholars": scholars.makeNode()
        ])
    
    return try drop.view.make("dashboard", dashboardView)
}

drop.run()
