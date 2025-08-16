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
                        <p class="tag">{tag}</p>
                    </li>
                {/each}
            </ul>
        {/each}
    </section>
</section>

<style>
    .tag-seg {
        width: 70%;

        & .tag-seg-search {
            width: 30%;
        }

        & .tag-seg-tags {
            width: 70%;

            display: grid;
            grid-template-columns: auto 1fr;

            & .tag-cat {
                font-weight: bold;
            }

            & ul {
                & li {
                    & .tag {
                        color: #6F6F6F;

                        &:hover {
                            transition: all 0.1s;
                            transform: scale(1.003);
                        }
                    }
                }
            }
        }

    }
</style>