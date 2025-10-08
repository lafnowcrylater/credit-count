<script lang='ts'>
    import { goto } from '$app/navigation';
    import { Label, Input, Button, Card } from "flowbite-svelte";

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
    
        <Button type="submit" onclick={check} >Submit</Button>
    </form>
  </Card>
</main>
