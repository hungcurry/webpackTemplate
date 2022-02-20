//-------------------
// 插件
//-------------------
import axios from 'axios'
// babel/polyfill 主要檔案
import 'core-js/stable';
import 'regenerator-runtime/runtime';



//-------------------
// 檔案
//-------------------
import css from 'style.css';
import scss from 'all.scss';
import item from 'object'

console.log(`dev` , PRODUCTION);




let test = () =>{
  return 'test'
}
class rest {
  #a =100
}

axios.get('https://hexschool.github.io/ajaxHomework/data.json')
.then((res)=>{
  console.log(res);
})
.catch((err)=>{
  console.log(response.err);
})

async function asyncApiRes(){
  console.log('async: 1');
  let res1 = await axios.get("https://hexschool.github.io/ajaxHomework/data.json");
  console.log('async: 2');
  let res2 = await axios.get("https://hexschool.github.io/ajaxHomework/data.json");

  console.log('async: 3');
  console.log({res1: res1.data, res2: res2.data, });
  console.log('async: 4');
}
asyncApiRes();


console.log(`白爛貓222`);
console.log(item.name);
