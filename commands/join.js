const { SlashCommandBuilder } = require( 'discord.js' );
const { joinVoiceChannel } = require( '@discordjs/voice' );
const Audio = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'join' )
        .setDescription( '음성 채널에 참가합니다.' ),
    async execute( interaction )
    {
        await interaction.deferReply( );
        
        if ( interaction.member.voice.channelId )
        {
            await interaction.editReply( `${interaction.member.voice.channel.name}에 참가합니다.` );

            const connection = joinVoiceChannel(
            {
                channelId : interaction.member.voice.channelId,
                guildId : interaction.guildId,
                adapterCreator : interaction.guild.voiceAdapterCreator
            } );

            const audio = new Audio( interaction.guildId );
            connection.subscribe( audio.player );
        }
        else
        {
            await interaction.editReply( { content: '먼저 음성채널에 참가해야합니다.', ephemeral : true } );
        }
    }
};