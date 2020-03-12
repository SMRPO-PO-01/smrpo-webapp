"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var rxjs_1 = require("rxjs");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(router) {
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        this.router.navigate(["/auth"], { clearHistory: true });
        return rxjs_1.of(false);
        /*return this.userService.getMe().pipe(
          map(() => {
            this.notificationService.getNotifications().subscribe();
            return true;
          }),
          catchError(() => {
            this.router.navigate(["/auth"], { clearHistory: true });
            return of(false);
          })
        );*/
    };
    AuthGuard = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
