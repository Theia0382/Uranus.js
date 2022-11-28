const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection, joinVoiceChannel } = require( '@discordjs/voice' );
const { getAudioPlayer, getPlaylist, play } = require('../modules/audio');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'play' )
        .setDescription( '재생목록을 재생합니다.' )
        .addStringOption( option => option
            .setName( 'url' )
            .setDescription( 'Youtube URL을 입력해주세요' ) ),
    async execute( interaction )
    {
        await interaction.deferReply( );

        let connection = getVoiceConnection( interaction.guildId );
        if ( !connection )
        {
            if ( interaction.member.voice.channelId )
            {
                connection = joinVoiceChannel(
                {
                    channelId : interaction.member.voice.channelId,
                    guildId : interaction.guildId,
                    adapterCreator : interaction.guild.voiceAdapterCreator
                } );
            }
            else
            {
                await interaction.editReply( { content: '먼저 음성채널에 참가해야합니다.', ephemeral : true } );
                return;
            }
        }

        const audioPlayer = getAudioPlayer( interaction.guildId );

        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });
        
        audioPlayer.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        });

        const playlist = getPlaylist( interaction.guildId );
        playlist[ 0 ] = interaction.options.getString( 'url' );
        connection.subscribe( audioPlayer );
        
        play( interaction.guildId );
        return true;
    }
};