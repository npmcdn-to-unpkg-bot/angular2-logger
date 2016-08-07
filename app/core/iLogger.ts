// Define the interface that all loggers must implement.
export interface ILogger {

    group( ...args: any[] ) : void;
    groupEnd( ...args: any[] ) : void;

    error(message?: any, ...args: any[] ) : void;
    warn(message?: any, ...args: any[] ) : void;
    info(message?: any, ...args: any[] ) : void;

    log(message?: any, ...args: any[] ) : void;
    debug(message?: any, ...args: any[] ) : void;

}
