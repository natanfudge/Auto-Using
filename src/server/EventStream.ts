// /*---------------------------------------------------------------------------------------------
//  *  Copyright (c) Microsoft Corporation. All rights reserved.
//  *  Licensed under the MIT License. See License.txt in the project root for license information.
//  *--------------------------------------------------------------------------------------------*/
// import { Subject } from "rxjs/Subject";
// import { Subscription } from "rxjs/Subscription";

// export class EventStream {
//     private sink: Subject<BaseEvent>;

//     constructor() {
//         this.sink = new Subject<BaseEvent>();
//     }

//     public post(event: BaseEvent) {
//         this.sink.next(event);
//     }

//     public subscribe(eventHandler: (event: BaseEvent) => void): Subscription {
//         return this.sink.subscribe(eventHandler);
//     }
// }