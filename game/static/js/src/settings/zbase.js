class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class = "ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登陆
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登陆</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <br>
        <!--
        <div class="ac-game-settings-acwing">
            <img width="30" src="http://112.124.23.44:8000/static/image/settings/acwing_logo.png">
            <div>
                AcWing一键登录
            </div>
        </div>
        -->
    </div>
    <div class="ac-game-settings-register">
         <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
            
        </div>
        <div class="ac-game-settings-option">
            登陆
        </div>
        <br>
        <br>
        <!--
        <div class="ac-game-settings-acwing">
            <img width="30" src="http://112.124.23.44:8000/static/image/settings/acwing_logo.png">
            <div>
                AcWing一键登录
            </div>
        </div>
        -->
    </div>


</div>
`);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if(this.root.access) {
            this.getinfo();
            //this.refresh_jwt_token();
        } else {
            this.login();
        }
        this.add_listening_events();
        
    }

    /*refresh_jwt_token() {
        setInterval(() => {
            $.ajax({
                url: "http://112.124.23.44/settings/token/refresh/",
                type: "post",
                data: {
                    refresh: this.root.refresh,
                },
                success: resp => {
                    this.root.access = resp.access;
                }
            });
        }, 1000);
    }*/


    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();
    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
            outer.register_on_remote();
        })
    }


    login_on_remote() { //在远程服务器上登陆
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "http://112.124.23.44:8000/settings/token/",
            type: "post",
            data: {
                username: username,
                password: password,
            },
            success: resp => {
                this.root.access = resp.access;
                this.root.refresh = resp.refresh;
                //this.refresh_jwt_token();
                this.getinfo();
            },
            error: () => {
                this.$login_error_message.html("用户名或密码错误");
            }
        });
    }

    register_on_remote() { //在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "http://112.124.23.44:8000/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                //console.log(resp);
                if(resp.result === "success") {
                    location.reload(); //  刷新页面
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() { // 在远程服务器上登出
        if(this.platform === "ACAPP") 
        {
            this.root.AcWingOS.api.window.close();
        }
        else{
            this.root.access = "";
            this.root.refresh = "";
            location.href = "/";
        }
    }

    register() {    //打开注册界面
        this.$login.hide();
        this.$register.show();
    }
    login() { //打开登陆界面
        this.$register.hide();
        this.$login.show();
    }

    getinfo() {
        $.ajax({
            url: "http://112.124.23.44:8000/settings/getinfo/",
            type: "GET",
            data: {
                platform: this.platform,
            },
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: resp => {
                //console.log(resp);
                if(resp.result === "success") {
                    this.username = resp.username;
                    this.photo = resp.photo;
                    this.hide();
                    this.root.menu.show();
                } else {
                    this.login();
                }
            }

        });
    }
    hide() {
        this.$settings.hide();

    }

    show() {
        this.$settings.show();
    }
}
