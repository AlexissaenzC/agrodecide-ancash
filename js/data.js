export const varieties=['Blanca','Yungay','Amarilla','Canchán'];
export const qualities=['Primera','Segunda'];
export const origins=['Carhuaz','Huaraz','Yungay','Marcará'];
const all=varieties;
export const buyers=[
 {id:'b1',name:'Acopio Valle Verde',town:'Carhuaz',x:285,y:190,varieties:all,qualities,min:100,max:5000,price:1.45,transport:60,commission:20,other:10,status:'disponible'},
 {id:'b2',name:'Mercado La Cosecha',town:'Huaraz',x:510,y:355,varieties:['Blanca','Yungay','Canchán'],qualities:['Primera'],min:300,max:3000,price:1.72,transport:180,commission:35,other:15,status:'por confirmar'},
 {id:'b3',name:'Asociación Buen Campo',town:'Marcará',x:400,y:270,varieties:all,qualities,min:50,max:1500,price:1.55,transport:90,commission:0,other:15,status:'disponible'},
 {id:'b4',name:'Compras Sol Andino',town:'Yungay',x:190,y:90,varieties:['Amarilla','Yungay'],qualities:['Primera'],min:200,max:4000,price:1.9,transport:130,commission:25,other:10,status:'disponible'},
 {id:'b5',name:'Bodega Santa Tierra',town:'Carhuaz',x:420,y:155,varieties:all,qualities,min:50,max:600,price:1.6,transport:35,commission:10,other:5,status:'por confirmar'},
 {id:'b6',name:'Distribuidora Los Álamos',town:'Huaraz',x:625,y:400,varieties:all,qualities,min:800,max:10000,price:1.65,transport:160,commission:30,other:20,status:'disponible'},
 {id:'b7',name:'Puesto Nuevo Horizonte',town:'Marcará',x:220,y:320,varieties:all,qualities,min:100,max:2000,price:null,transport:80,commission:10,other:5,status:'sin información'},
 {id:'b8',name:'Cooperativa Raíces',town:'Huaraz',x:635,y:255,varieties:['Blanca','Canchán'],qualities:['Segunda'],min:100,max:6000,price:1.3,transport:110,commission:0,other:10,status:'por confirmar'}
].map(b=>({...b,date:'2026-11-07'}));
