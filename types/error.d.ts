// ------------------------------------------------------------------------------
// name: error.d
// author: 喵大斯( mschool.tech )
// created: 2019/8/5
// ------------------------------------------------------------------------------

// ----------------------------------------
// ServiceError
// ----------------------------------------

export interface ServiceError extends Error {
  code:string;
}

export interface ServiceErrorConstructor {
  new(message?:string, code?:string):ServiceError;
  (message?:string, code?:string):ServiceError;
  readonly prototype:ServiceError;
}

export declare const ServiceError:ServiceErrorConstructor;

// ----------------------------------------
// property_name
// ----------------------------------------

export declare type Payload = { [key:string]:any };
export declare type State = { [key:string]:any };
export declare type ActionConf = { type:string, payload:Payload };

export interface ActionError extends Error {
  action:ActionConf;
  state:State;
}

export interface ActionErrorrConstructor {
  new(message?:string, action?:ActionConf, state?:State):ActionError;
  (message?:string, action?:ActionConf, state?:State):ActionError;
  readonly prototype:ActionError;
}

export declare const ActionError:ActionErrorrConstructor;
