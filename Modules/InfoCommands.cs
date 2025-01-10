using Discord;
using Discord.Interactions;
using InteractionFramework.Attributes;
using System;
using System.Threading.Tasks;

namespace InteractionFramework.Modules;

public class InfoCommands : InteractionModuleBase<SocketInteractionContext>
{
    public InteractionService Commands { get; set; }

    private InteractionHandler _handler;

    public InfoCommands(InteractionHandler handler)
    {
        _handler = handler;
    }

    [SlashCommand("ping", "Pings the bot and returns its latency.")]
    public async Task PingAsync()
    {
        await RespondAsync(text: $":ping_pong: It took me {Context.Client.Latency}ms to respond to you!", ephemeral: true);
    }

    [SlashCommand("info", "Retrieves any important bot information.")]
    public async Task InfoAsync()
    {
        var embed = new EmbedBuilder()
            .WithAuthor("Potassium Software", "https://avatars.githubusercontent.com/u/125838608", "https://github.com/PotassiumSoftware")
            .WithTitle("Bot Info")
            .WithDescription("placeholder placeholder")
            .AddField("Links", "[Source Code](https://github.com/PotassiumSoftware/Jax)", false)
            .WithColor(Color.Blue)
            .WithCurrentTimestamp()
            .Build();

        await RespondAsync(embed: embed);
    }
}
