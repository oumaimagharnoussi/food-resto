import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class SseService {
  constructor(private http:HttpClient) { }
  evs:EventSourcePolyfill;
  private subj=new BehaviorSubject([]);
  returnAsObservable()
  {
  return this.subj.asObservable();
  }
  GetExchangeData(url)
  {
  let subject=this.subj;
  if(typeof(EventSource) !=='undefined')
  {
  this.evs=new EventSource(environment.SSE_url+'/.well-known/mercure?topic='+environment.BACKEND+'/api/'+url+'/{id}'
  );

  
  
  
  


  this.evs.onopen=function(e)
  {
  console.log("Opening connection.Ready State is "+this.readyState);
  }
  this.evs.onmessage=function(e)
  {
  console.log("Message Received.Ready State is "+this.readyState);
  
  subject.next(JSON.parse(e.data));
  }
  this.evs.addEventListener("timestamp",function(e)
  {
  console.log("Timestamp event Received.Ready State is "+this.readyState);
  subject.next(e["data"]);
  })
  this.evs.onerror=function(e)
  {
  console.log(e);
  if(this.readyState==0)
  {
  console.log("Reconnecting…");
  }
  }
  }
  }

  


  stopExchangeUpdates()
  {
  this.evs.close();
  }
  

    
}
