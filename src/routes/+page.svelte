<script lang='ts'>
    import { goto } from '$app/navigation';
    import { Label, Input, Card } from "flowbite-svelte";

    let form = { email: '', password: ''};

    function check() {
        console.log("working");
        // if (form.email === "a@gmail.com" && form.password === "123456") {
        //     goto('/home');
        // } else {
        //     alert("Invalid login");
        // }
        goto('/home');
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<main class="h-screen flex items-center justify-center bg-gray-100">
  <Card size="lg" class="w-md h-fit rounded-xl p-4 sm:p-8 md:p-8">
    <form method="POST">
        <h1 class="text-center text-3xl">Login</h1>
        <Label for="email" class="mb-2 block">Email</Label>
        <Input id="email" type='email' placeholder="Example@gmail.com"  autocomplete='email' bind:value={form.email} required/>
      
        <Label for="password" class="mb-2 block">Password</Label>
        <Input id="password" type='password' bind:value={form.password} autocomplete="current-password" required/>
    
        <button type="submit" onclick={check}>Submit</button>
    </form>
  </Card>
</main>

<style>
  button {
    display: block;
    height: 40px;
    line-height: 40px;
    margin: auto;
    /* padding: 0.6em 1.2em; */
    padding: 0px 1.4em;
    border-radius: 8px;
    border: 1px solid transparent;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #e07b17;
    margin-top: 24px;
    cursor: pointer;
    transition: border-color 0.25s;
  }

  button:hover {
    background-color: #d37416;
  }
</style>
