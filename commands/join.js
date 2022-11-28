const { SlashCommandBuilder } = require( 'discord.js' );
const { joinVoiceChannel } = require( '@discordjs/voice' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'join' )
        .setDescription( '음성 채널에 참가합니다.' ),
    async execute( interaction )
    {
        if ( interaction.member.voice.channelId )
        {
            await interaction.reply( `${interaction.member.voice.channel.name}에 참가합니다.` );

            await joinVoiceChannel(
            {
                channelId : interaction.member.voice.channelId,
                guildId : interaction.guildId,
                adapterCreator : interaction.guild.voiceAdapterCreator
            } );
        }
        else
        {
            await interaction.reply( { content: '먼저 음성채널에 참가해야합니다.', ephemeral : true } );
        }
    }
};