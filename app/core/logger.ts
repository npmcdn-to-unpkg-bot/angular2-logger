import {Injectable, Optional} from "@angular/core";
import {ILogger} from "./iLogger"
import {Level} from "./level";


export class Options {
    level: Level;
    global: boolean;
    globalAs: string;
    store: boolean;
    storeAs: string;
}

// Temporal until https://github.com/angular/angular/issues/7344 gets fixed.
const DEFAULT_OPTIONS: Options = {
    level: Level.WARN,
    global: true,
    globalAs: "logger",
    store: false,
    storeAs: "angular2.logger.level"
};

@Injectable()
export class Logger implements ILogger {

    private _level: Level;
    private _globalAs: string;
    private _store: boolean;
    private _storeAs: string;

    Level:any = Level;

    constructor( @Optional() options?: Options ) {

        // Move this to the constructor definition when optional parameters are working with @Injectable: https://github.com/angular/angular/issues/7344
        let { level, global, globalAs, store, storeAs } = Object.assign( {}, DEFAULT_OPTIONS, options );

        this._level = level;
        this._globalAs = globalAs;
        this._storeAs = storeAs;

        global && this.global();

        if ( store || this._loadLevel() ) this.store();

    }

    private _loadLevel = (): Level => localStorage.getItem( this._storeAs );
    private _storeLevel(level: Level) { localStorage[ this._storeAs ] = level; }

    public error(message?: any, ...optionalParams: any[]) {
        this.isErrorEnabled() && console.error.apply( console, arguments );
    }

    public warn(message?: any, ...optionalParams: any[]) {
        this.isWarnEnabled() && console.warn.apply( console, arguments );
    }

    public info(message?: any, ...optionalParams: any[]) {
        this.isInfoEnabled() && console.info.apply( console, arguments );
    }

    public debug(message?: any, ...optionalParams: any[]) {
        this.isDebugEnabled() && console.debug.apply( console, arguments );
    }

    public log(message?: any, ...optionalParams: any[]) {
        this.isLogEnabled() && console.log.apply( console, arguments );
    }

    public group( ...args: any[] ) : void {
        ( console && console.group ) && console.group.apply( console, arguments );
    }

    public groupEnd( ...args: any[] ) : void {
        ( console && console.groupEnd ) && console.groupEnd.apply( console, arguments );
    }


    global = () => ( <any> window )[this._globalAs] = this;

    store(): Logger {

        this._store = true;
        let storedLevel = this._loadLevel();
        if ( storedLevel ) { this._level = storedLevel; }
        else { this._storeLevel( this.level ); }

        return this;

    }

    unstore(): Logger {
        this._store = false;
        localStorage.removeItem( this._storeAs );
        return this;
    }

    isErrorEnabled = (): boolean => this.level >= Level.ERROR;
    isWarnEnabled = (): boolean => this.level >= Level.WARN;
    isInfoEnabled = (): boolean => this.level >= Level.INFO;
    isDebugEnabled = (): boolean => this.level >= Level.DEBUG;
    isLogEnabled = (): boolean => this.level >= Level.LOG;

    get level(): Level { return this._level; }

    set level(level: Level) {
        this._store && this._storeLevel(level);
        this._level = level;
    }

}
