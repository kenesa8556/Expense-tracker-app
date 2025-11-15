const currentuser = localStorage.getItem("loggedinuser");

if(!currentuser){
    alert("please login frist");
    window.location.href = "index.html";
};
        document.getElementById("customer").innerHTML = `${currentuser}`;

document.getElementById("bar").addEventListener('click',()=>{
document.querySelector(".side").classList.add("active");
});
document.querySelector(".side i").addEventListener('click',()=>{
document.querySelector(".side").classList.remove("active");

})

document.getElementById("sav").addEventListener('click',() =>{
  const savinggoal = document.getElementById("savingsGoal").value.trim();
  const savinglo = JSON.parse(localStorage.getItem("saving-goal")) || [];
const user = savinglo.filter(u => u.user === currentuser);
  if(savinglo.some(user => user.user === currentuser)){
    
    user.map(u =>{
      u.saving = savinggoal
    })
    localStorage.setItem("saving-goal",JSON.stringify(savinglo));

    alert("u succesfully update the saving goal");
  }else{

    savinglo.push({
      saving : savinggoal,
      user : currentuser
    })
    localStorage.setItem("saving-goal",JSON.stringify(savinglo));
  alert("u are succesfully registered");
  }
  savinggoal.value = "";
  renderdashboard();
})






    const toggle = document.getElementById("dark-toggle");

    // Load saved mode
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });











const sidebarItems = document.querySelectorAll(".side ul li");
const contentDivs = document.querySelectorAll(".content");

sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    const targetId = item.getAttribute("data-target");

    // Hide all content divs
    contentDivs.forEach(div => div.classList.remove("active"));

    // Show the selected one
    document.getElementById(targetId).classList.add("active");
  });
});

document.getElementById("expenseformsection").addEventListener('submit',(e) =>{
    e.preventDefault()
    const form = e.target;
    const transsaction ={
        amount : parseFloat(form.amount.value),
        category: form.category.value,
        Date : form.date.value,
        Note : form.notes.value,
        type : form.type.value,
        username: currentuser,
    }
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactions.push(transsaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    form.reset();
    renderdashboard();
updateprogress();

});

function highestexpense(){
    const summary = getExpenseSummary(currentuser);

    let topcategoary = "";
    let maxamount = 0;

    for (const category in summary){
      
      if(summary[category] > maxamount){
        maxamount = summary[category];
        topcategoary = category;
      }
      
    }
    return {topcategoary , maxamount}
}





function  updateprogress(transactions){
    const savinglo = JSON.parse(localStorage.getItem("saving-goal")) || [];
      const userExpenses = transactions.filter(t => t.username === currentuser && t.type === "Expense");
      const budget = transactions.filter(t => t.username === currentuser && t.type === "income");
      const usersaving = savinglo.find(t => t.user === currentuser);
      const totalspent = userExpenses.reduce((sum, t) => sum + parseFloat(t.amount),0);
      const totalincome = budget.reduce((sum, t) => sum + parseFloat(t.amount),0);
      const remaining = totalincome - totalspent;

      const progress = Math.min(remaining / usersaving.saving * 100, 100);

document.getElementById("progressFill").style.width =`${progress}%`;
document.getElementById("progressText").textContent =`You have covered ${progress.toFixed(0)}% of your ${usersaving.saving} saving goal`;

if(progress <= 40){
document.getElementById("progressFill").style.backgroundColor =`red`;

}else if(progress <= 60 && progress > 40){
document.getElementById("progressFill").style.backgroundColor =`yellow`;

}else{
document.getElementById("progressFill").style.backgroundColor =`#4caf50`;

}
console.log()
}

function renderdashboard(){

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const savinglog = JSON.parse(localStorage.getItem("saving-goal")) || [];
const usersaving2 = savinglog.find(u => u.user === currentuser);
    const usertransaction = transactions.filter(t => t.username === currentuser);
const outsaving = document.querySelector(".savingout");

 outsaving.innerHTML = `your saving goal is ${usersaving2.saving}`;

    let income = 0;
    let expense = 0;
    const List = document.getElementById("transactionList");
    List.innerHTML = "";

    usertransaction.forEach((t,id) => {
        if(t.type === "income"){
            income += t.amount;
        }
        
        else{
            expense += t.amount
        }
        const item = document.createElement("li");

        item.innerHTML = `
      <span>${t.Date} - $${t.amount} ${t.category}(${t.type})</span>
      <button onclick="deleteTransaction(${id})">🗑️</button>
    `;

        List.appendChild(item);


    });


    document.getElementById("totalincome").textContent = income.toFixed(2);
    document.getElementById("totalexpenses").textContent = expense.toFixed(2);
    document.getElementById("savings").textContent = (income - expense).toFixed(2);

 const {topcategoary , maxamount} = highestexpense();

 
 document.getElementById("top-spending").textContent =
  `⚠️ Your top spending category is ${topcategoary} with $${maxamount}.`;



  updateprogress(transactions);
    renderChart(usertransaction);
}



function deleteTransaction(index) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateprogress(transactions);
  renderdashboard();
  const summary = getExpenseSummary(currentuser);
highestexpense()
  renderChart(summary);

}

let expensechart = null;


function renderChart(transactions) {
  const expenseData = {};
  transactions.forEach(t => {
    if (t.type === "Expense") {
      expenseData[t.category] = (expenseData[t.category] || 0) + t.amount;
    }
  });
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if(expensechart){
    expensechart.destroy()
  }



  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(expenseData),
      datasets: [{
        data: Object.values(expenseData),
        backgroundColor: ["#000", "#728b03", "#b30623", "#ff9800"],
      }],
    },
  });
  
  updateprogress(transactions);
  renderdashboard()
}



document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedinuser");
  window.location.href = "index.html";
});


function getExpenseSummary(username) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const userExpenses = transactions.filter(t => t.username === username && t.type === "Expense");

  const summary = {};
  userExpenses.forEach(t => {
    summary[t.category] = (summary[t.category] || 0) + t.amount;
  });

  return summary;
}




function formatSummary(summary) {
  if (!summary || Object.keys(summary).length === 0) {
    return "No expenses found.";
  }

  return Object.entries(summary)
    .map(([category, amount]) => `- ${category}: $${amount}`)
    .join("\n");
}







document.getElementById("generatePlanBtn").addEventListener("click", async () => {
  const username = localStorage.getItem("loggedinuser");
if (!username) {
  alert("No user is logged in. Please log in first.");
  return;
}

  const summary = getExpenseSummary(username);
  const summaryText = formatSummary(summary);

  const prompt = `I'm ${username}. Here's my monthly spending summary:\n${summaryText}\n\nPlease suggest a personalized plan to reduce my expenses. Focus on realistic tips, category-specific advice, and ways I can save based on this data only i don't ask further this.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "tngtech/deepseek-r1t2-chimera:free",
      messages: [
        { role: "system", content: "You are a financial assistant that helps users reduce expenses." },
        { role: "user", content: prompt }
      ]
    })
  });

  const result = await response.json();
  document.getElementById("planOutput").textContent = result.choices[0].message.content;
});








window.addEventListener("DOMContentLoaded", () => {
  renderdashboard();
});















