//bill.service.js
getBills(){
    return this.httpClient.get(this.url+"/bill/getBills");
}

delete(id:any){
    return this.httpClient.delete(this.url+
        "/bill/delete/"+id,{
        headers:new HttpHeaders().set('Content-Type',"application/json");
    })
}
//material-component folder -> right click -> Open in Intergrated Terminal -> ng g c view-bill