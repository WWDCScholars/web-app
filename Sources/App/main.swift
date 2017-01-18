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
drop.preparations.append(AdminUser.self)

let auth = AuthMiddleware<AdminUser>()
drop.middleware.append(auth)

drop.get { request in
    let user = try? request.auth.user()
    
    if user == nil {
        return Response(redirect: "/login")
    }else {
        return Response(redirect: "/dashboard")
    }
}

drop.get("dashboard") { request in
    let user = try? request.auth.user()
    
    if user == nil {
        return Response(redirect: "/login")
    }
    
    var dashboardView = try Node(node: [
        "pagename": "Dashboard",
        "authenticated": user != nil,
        "baseURL": request.baseURL
        ])
    dashboardView["account"] = try user?.makeNode()
    
    return try drop.view.make("dashboard", dashboardView)
}

drop.get("login") { request in
    return try drop.view.make("login", [
        "pagename": "Login",

        //    	"message": drop.loca÷lization[req.lang, "welcome", "title"]
        ])
}

drop.post ("login") { request in
    guard let username = request.formURLEncoded?["username"]?.string,
        let password = request.formURLEncoded?["password"]?.string else {
            return try drop.view.make("login", ["flash": "Missing username or password"])
    }
    let credentials = UsernamePassword(username: username, password: password)
    do {
        try request.auth.login(credentials)
        return Response(redirect: "/")
    } catch let e {
        return try drop.view.make("login", ["flash": "Invalid username or password"])
    }
}

drop.get("amnusr-mngt") { request in
    let user = try? request.auth.user()
    
    if user == nil {
        return Response(redirect: "/login")
    }
    
    return try drop.view.make("adminuser-management", [
        "pagename": "Manage admin users",
        "authenticated": user != nil,
        "baseURL": request.baseURL,
        "users": AdminUser.query().all().makeNode()
        //    	"message": drop.loca÷lization[req.lang, "welcome", "title"]
        ])
}

drop.delete("amnusr-mngt") { request in
    guard let id = request.query?["id"]?.string else {
        return "$.notify({ icon: \"pe-7s-attention\", message: \"Missing id in delete request\" },{ type: 'danger', timer: 4000, placement: { from: 'top', align: 'right' } });"
    }
    
    let deleted = try? AdminUser.find(id)?.delete()
    if deleted == nil {
        return "$.notify({ icon: \"pe-7s-attention\", message: \"Could not delete user\" },{ type: 'danger', timer: 4000, placement: { from: 'top', align: 'right' } });"
//        return try drop.view.make("error", ["flash": "Missing deletion ID"])
    }else {
        return "$.notify({ icon: \"pe-7s-check\", message: \"User deleted.\" },{ type: 'success', timer: 4000, placement: { from: 'top', align: 'right' } });"
    }

}

//drop.get { req in
//    return try drop.view.make("welcome", [
//    	"message": drop.localization[req.lang, "welcome", "title"]
//    ])
//}

//drop.resource("posts", PostController())
drop.collection(APIRouter())

drop.run()
