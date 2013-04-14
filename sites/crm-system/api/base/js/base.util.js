
// ---------------------------------------------------------------------------


if (!window.bb)
    window.bb = {};

if (!window.bb.url)
    window.bb.url = {}; 

bb.url = function() {
    this.href = "";
    this.hash = "";
    this.dl = "";
    this.hashed = false;
    this.param_info = "#"; // can be # or ?
    this.param_type = "path"; // can be path, querystring or form
    this.param_separator = "/"; // can be / or &
    this.param_value_separator = "/"; // can be / or =
    this.fn_callback;
    xlreturn_url_obj = this;
}

bb.url.prototype = {
    //-------------------------------------------------
    set_url_state: function() {
        this.dl = document.location;
        this.href = document.location.href;
        this.hash = document.location.hash;
    }
    ,
    //-------------------------------------------------
    get_href: function() {
        return href;
    }
    ,
    //-------------------------------------------------
    get_hash: function() {
        return hash;
    }
    ,
    //-------------------------------------------------
    get_dl: function() {
        return this.dl;
    }
    ,
    //-------------------------------------------------
    is_hashed: function() {
        this.hashed = false;
        if (this.href.indexOf("#") > -1) {
            this.hashed = true;
        }
        return this.hashed;
    }
    ,
    //-------------------------------------------------
    get_url_param_value: function(href, key) {
        var value = "";
        if (href.indexOf(key + "/") > -1) {
            var params = href.split("/");
            for (var i = 0; i < params.length; i++) {
                if (params[i] == key) {
                    if (params[i + 1] != null) {
                        value = params[i + 1];
                    }
                }
            }
        }
        return value;
    }
    ,
    //-------------------------------------------------
    change_url_to_state: function(href, param, paramvalue) {

        var _returnurl = "";

        if (href.indexOf(param) > -1) {
            // hash contains param, just update
            var _params = href.split(this.param_value_separator);
            for (var i = 0; i < _params.length; i++) {
                if (_params[i] == param) {
                    _params[i + 1] = paramvalue;
                }
            }
            _returnurl = _params.join(this.param_value_separator);
        }
        else {
            // has not present, append it
            if (href.indexOf(param + this.param_value_separator) == -1) {
                if (href.lastIndexOf(this.param_value_separator) == href.length - 1)
                    href = href.substr(0, href.length - 1);
                _returnurl = href + this.param_value_separator + param + this.param_value_separator + paramvalue;
            }
        }
        return _returnurl;
    }
}

webutil = new bb.url();

//webutil.get_url_param_value
//webutil.change_url_to_state();



function _log(name, value) {
    try {
        if (console && console.info)
            console.info(name, value);
    }
    catch (e) {
    }
}

function get_current_date() {
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    
    var str = '';
    str = str + month + "/" + day + "/" + year + " ";
    if (minutes < 10) {
        minutes = + "0" + minutes
    }
    if (hours < 10) {
        hours = + "0" + hours
    }
    str = str + " " + hours + ":" + minutes + " ";
    if(hours > 11) {
        str = str + "PM"
    } 
    else {
        str = str + "AM"
    }
    return str;
}


(function($) {
    /*----------------------------------------------------------------------------------
    Class: FloatObject
    -------------------------------------------------------------------------------------*/
    function FloatObject(jqObj, params) {
        this.jqObj = jqObj;

        switch (params.speed) {
            case 'fast': this.steps = 5; break;
            case 'normal': this.steps = 10; break;
            case 'slow': this.steps = 20; break;
            default: this.steps = 10;
        };

        var offset = this.jqObj.offset();

        this.currentX = offset.left;
        this.currentY = offset.top;
        this.width = this.jqObj.width();
        this.height = this.jqObj.height();
        this.alwaysVisible = params.alwaysVisible;


        this.origX = typeof (params.x) == "string" ? this.currentX : params.x;
        this.origY = typeof (params.y) == "string" ? this.currentY : params.y;
        //if( params.y) this.origY = params.y;


        //now we make sure the object is in absolute positions.
        this.jqObj.css({ 'position': 'absolute', 'top': this.currentY, 'left': this.currentX });
    }

    FloatObject.prototype.updateLocation = function() {
        this.updatedX = $(window).scrollLeft() + this.origX;
        this.updatedY = $(window).scrollTop() + this.origY;

        if (this.alwaysVisible) {
            if (this.origX + this.width > this.windowWidth())
                this.updatedX = this.windowWidth() - this.width + $(window).scrollLeft();
            if (this.origY + this.height > this.windowHeight())
                this.updatedY = this.windowHeight() - this.height + $(window).scrollTop();

        }
        this.dx = Math.abs(this.updatedX - this.currentX);
        this.dy = Math.abs(this.updatedY - this.currentY);

        return this.dx || this.dy;
    }

    FloatObject.prototype.windowHeight = function() {
        var de = document.documentElement;

        return self.innerHeight ||
			(de && de.clientHeight) ||
			document.body.clientHeight;
    }

    FloatObject.prototype.windowWidth = function() {
        var de = document.documentElement;

        return self.innerWidth ||
			(de && de.clientWidth) ||
			document.body.clientWidth;
    }


    FloatObject.prototype.move = function() {
        if (this.jqObj.css("position") != "absolute") return;
        var cx = 0;
        var cy = 0;

        if (this.dx > 0) {
            if (this.dx < this.steps / 2)
                cx = (this.dx >= 1) ? 1 : 0;
            else
                cx = Math.round(this.dx / this.steps);

            if (this.currentX < this.updatedX)
                this.currentX += cx;
            else
                this.currentX -= cx;
        }

        if (this.dy > 0) {
            if (this.dy < this.steps / 2)
                cy = (this.dy >= 1) ? 1 : 0;
            else
                cy = Math.round(this.dy / this.steps);

            if (this.currentY < this.updatedY)
                this.currentY += cy;
            else
                this.currentY -= cy;
        }

        this.jqObj.css({ 'left': this.currentX, 'top': this.currentY });
    }



    /*----------------------------------------------------------------------------------
    Object: floatMgr
    -------------------------------------------------------------------------------------*/
    $.floatMgr = {

        FOArray: new Array(),

        timer: null,

        initializeFO: function(jqObj, params) {
            var settings = $.extend({
                x: 0,
                y: 0,
                speed: 'normal',
                alwaysVisible: false
            }, params || {});
            var newFO = new FloatObject(jqObj, settings);

            $.floatMgr.FOArray.push(newFO);

            if (!$.floatMgr.timer) $.floatMgr.adjustFO();

            //now making sure we are registered to all required window events
            if (!$.floatMgr.registeredEvents) {
                $(window).bind("resize", $.floatMgr.onChange);
                $(window).bind("scroll", $.floatMgr.onChange);
                $.floatMgr.registeredEvents = true;
            }
        },

        adjustFO: function() {
            $.floatMgr.timer = null;

            var moveFO = false;

            for (var i = 0; i < $.floatMgr.FOArray.length; i++) {
                FO = $.floatMgr.FOArray[i];
                if (FO.updateLocation()) moveFO = true;
            }

            if (moveFO) {
                for (var i = 0; i < $.floatMgr.FOArray.length; i++) {
                    FO = $.floatMgr.FOArray[i];
                    FO.move();
                }

                if (!$.floatMgr.timer) $.floatMgr.timer = setTimeout($.floatMgr.adjustFO, 50);
            }
        },

        onChange: function() {
            if (!$.floatMgr.timer) $.floatMgr.adjustFO();
        }
    };

    /*----------------------------------------------------------------------------------
    Function: makeFloat
    -------------------------------------------------------------------------------------*/
    $.fn.makeFloat = function(params) {
        var obj = this.eq(0); //we only operate on the first selected object;
        $.floatMgr.initializeFO(obj, params);
        if ($.floatMgr.timer == null) $.floatMgr.adjustFO();
        return obj;
    };
})(jQuery);