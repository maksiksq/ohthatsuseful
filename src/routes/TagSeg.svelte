<script>
    let { query = $bindable(), tags } = $props();
</script>
<section class="tag-seg">
    <section class="tag-seg-search">
        <input name="query" id="query" class="search" type="text" autocomplete="off" placeholder="Search..."
               bind:value={query}/>
        <button class="sr-only">Search</button>
    </section>
    <section class="tag-seg-tags">
        {#each Object.entries(tags) as [key, values] (key)}
            <p class="tag-cat">{key}</p>
            <ul>
                {#each values as tag (tag)}
                    <li>
                        <button class="tag">#{tag}</button>
                    </li>
                {/each}
            </ul>
        {/each}
    </section>
</section>

<style>
    .tag-seg {
        width: 70%;
        margin-top: 2rem;
        flex-direction: row;

        & .tag-seg-search {
            width: 25%;
            display: flex;
            justify-content: center;

            & .search {
                all: unset;
                width: 40%;
                background-color: white;
                border: 1px solid #151515;
                border-radius: 2px;
                color: #6F6F6F;
                padding: 0.2rem 2rem 0.2rem 0.7rem;
                font-size: 1rem;
            }

            & .search::placeholder {
                color: #6F6F6F;
            }
        }

        & .tag-seg-tags {
            width: 75%;
            padding-left: 3rem;

            display: grid;
            grid-template-columns: auto 1fr;
            gap: 1rem;

            border-left: 1px solid #151515;

            & .tag-cat {
                font-weight: bold;
            }

            & ul {
                display: flex;
                flex-wrap: wrap;

                padding-left: 1rem;

                & li {
                    padding-left: 0.7rem;
                    & .tag {
                        color: #6F6F6F;
                        cursor: pointer;

                        &:hover {
                            transition: all 0.1s;
                            transform: scale(1.003);
                            color: black;
                        }
                    }
                }
            }
        }

    }
</style>