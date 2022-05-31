"use strict";
var State;
(function (State) {
    State[State["PENDING"] = 0] = "PENDING";
    State[State["DONE"] = 1] = "DONE";
    State[State["TRANSFER"] = 2] = "TRANSFER";
})(State || (State = {}));
var Status;
(function (Status) {
    Status[Status["OPEN"] = 0] = "OPEN";
    Status[Status["CLOSED"] = 1] = "CLOSED";
})(Status || (Status = {}));
