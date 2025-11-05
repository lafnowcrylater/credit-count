<script lang='ts'>
    import { goto } from '$app/navigation';
    import { Label, Input, Card } from "flowbite-svelte";
    import { base } from '$app/paths';

    let form = { email: '', password: ''};

    function check() {
        console.log("working");
        // if (form.email === "a@gmail.com" && form.password === "123456") {
        //     goto('/home');
        // } else {
        //     alert("Invalid login");
        // }
        goto('{base}/home');
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<main class="h-screen flex items-center justify-center bg-gray-100">
  <Card size="lg" class="w-md h-fit rounded-xl p-4 sm:p-8 md:p-8">
    <h1 class="text-center text-3xl">Login to Credit Count</h1>
    <div class="pt-8 pb-6">
      <button class="w-full h-[40px] bg-transparent border border-gray-300 rounded-lg mb-4 cursor-pointer">Sign in with Google</button>
      <button class="w-full h-[40px] bg-transparent border border-gray-300 rounded-lg mb-8 cursor-pointer">Sign in with Microsoft</button>
      <hr class="text-gray-300">
    
    </div>
    <form method="POST">
        <Label for="email" class="mb-2 block">Email</Label>
        <Input id="email" type='email' placeholder="Example@gmail.com"  autocomplete='email' bind:value={form.email} required/>
      
        <Label for="password" class="mb-2 block">Password</Label>
        <Input id="password" type='password' bind:value={form.password} autocomplete="current-password" required/>
    
        <button class="block h-[40px] m-auto mt-[24px] px-[1.4em] font-medium border border-transparent rounded-lg bg-[#e07b17] cursor-pointer hover:bg-[#d37416] transition-colors duration-100" 
          type="submit" onclick={check}>Login
        </button>
    </form>


  </Card>
</main>
