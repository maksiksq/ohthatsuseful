<script>
</script>

<main>
    <p class="dungeon">Welcome back to the dungeon my leige.</p>
    <p class="dungeon-2">We <a href="https://en.wikipedia.org/wiki/Guard_goose" title="this is an actual thing I kid you not">guard geese</a> shall scare off any intruders.</p>
    <form method="POST" action="/auth/login">
        <input type="text" name="username" placeholder="username">
        <input type="password" name="password" placeholder="password">
    </form>
<!--    <p>{form.threat}</p>-->
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        background-image: url("/img/geese.avif");
        background-size: cover;

        width: 100vw;
        height: 100vh;

        & .dungeon {
            font-size: 2rem;
            color: white;
            font-weight: bold;
            font-family: 'Rozanova', sans-serif;
            -webkit-text-stroke: 1px black;
        }

        & .dungeon-2 {
            color: white;
            font-size: 1.6rem;
            font-weight: bold;
            font-family: 'Rozanova', sans-serif;
            -webkit-text-stroke: 1px black;

            & a {
                color: blue;
                text-decoration: underline;
                -webkit-text-stroke: 0 black;
            }
        }

        & form {
            margin-bottom: 30vh;

            display: flex;
            flex-direction: column;
            gap: 1rem;

            & input {
                all: unset;
                background-color: #151515;
                border: white 1px solid;
                padding: 0.5rem 6rem 0.5rem 0.3rem;
            }

            & input::placeholder {
                color: white;
            }
        }
    }
</style>