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
    public async Task GreetUserAsync()
        => await RespondAsync(text: $":ping_pong: It took me {Context.Client.Latency}ms to respond to you!", ephemeral: true);
}
