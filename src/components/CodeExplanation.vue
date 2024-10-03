<template>
    <div>
      <h2>代码解释</h2>
      <!-- Content for code explanation goes here -->
    </div>

    <br>
    <br>
    <hr>
    <input type="text" id="input">
    <button id="btn2" @click="getInput" >写入hello.txt</button>
    <br>
    <br>
    <hr>
    <button id="btn3" @click="test3" >读取hello.txt</button>
  </template>
  
  <script>
  export default {
    methods: {
      getInput() {
      document.getElementById("btn2").addEventListener("click", function() {
      const input = document.getElementById("input");
      const content = input.value;
      window.myAPI.saveFile(content)
      console.log(content);
      });
    }, 
    async test3() {
      let data = await window.myAPI.readFile()
      alert(data)
      console.log("data", data)
    }
    }
  }
  </script>