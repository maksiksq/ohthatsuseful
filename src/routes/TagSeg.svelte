<script lang="ts">
    let { tags, query = $bindable(), selectedTags = $bindable() } = $props();

    const handleTagClick = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            selectedTags = [...selectedTags, tag];
            return;
        }

        selectedTags = selectedTags.filter((t: String) => t !== tag);
    }


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
                        <button class={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`} onclick={() => {handleTagClick(tag)}}>#{tag}</button>
                    </li>
                {/each}
            </ul>
        {/each}
    </section>
</section>

<style>
    .selected {
        color: black !important;
    }

    .tag-seg {
        width: 70%;
        margin-top: 2rem;
        flex-direction: row;

        @media (max-width: 769px) {
            width: 100%;
            flex-direction: column;
            justify-content: flex-start;
        }

        & .tag-seg-search {
            width: 40%;
            display: flex;
            justify-content: center;

            @media (max-width: 769px) {
                width: 100%;
                margin-top: 3rem;
                order: 2;
            }

            & .search {
                all: unset;
                width: 70%;
                background-color: white;
                border: 1px solid #151515;
                border-radius: 32px;
                color: #6F6F6F;
                padding: 0.6rem 2rem 0.6rem 0.7rem;
                margin-right: 3rem;
                font-size: 1rem;

                @media (max-width: 769px) {
                    margin-right: 0;
                    width: 70%;

                    padding: 0.3rem 2rem 0.3rem 0.7rem;
                }
            }

            & .search::placeholder {
                color: #6F6F6F;
            }
        }

        & .tag-seg-tags {
            width: 60%;
            padding-left: 3rem;

            display: grid;
            grid-template-columns: auto 1fr;
            gap: 1rem;

            border-left: 1px solid #151515;

            @media (max-width: 769px) {
                padding-left: 0;
                box-sizing: border-box;
                padding-right: 1.5rem;
                width: calc(100% - 2rem);
                margin-left: 2rem;
                align-items: center;
            }

            & .tag-cat {
                font-weight: bold;

                @media (max-width: 769px) {
                    box-sizing: border-box;
                    padding-left: 1rem;
                    border-left: 3px solid #151515;
                }
            }

            & ul {
                display: flex;
                flex-wrap: wrap;

                padding-left: 1rem;

                @media (max-width: 769px) {
                    padding-left: 0;
                }

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

                        @media (max-width: 769px) {
                            &:hover {
                                transition: all 0.1s;
                                transform: scale(1.003);
                                color: #6F6F6F;
                            }
                        }
                    }
                }
            }
        }

    }
</style>