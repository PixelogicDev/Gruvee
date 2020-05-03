// creativenobu - "The forbidden apple auth" (02/16/20)
import React from 'react'
import { firebase } from '@react-native-firebase/auth'
import appleAuth, {
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication'
import { ApplePlatform } from 'Gruvee/config/socials'
import SocialPlatform from 'Gruvee/lib/SocialPlatform'
import { CreateNewUserDocument } from 'Gruvee/firestore/userActions'
import SocialAuthButton from './SocialAuthButton'
import { CreateDocumentAndSignIn } from './actions/SharedActions'
import { InitAppleMusicAuthFlow } from './actions/AppleActions'

const AppleAuthButton = () => {
    const signInWithAppleAction = async () => {
        try {
            /*    if (!appleAuth.isSupported) {
                return Promise.reject(new Error('Device is not on iOS 13 or higher.'))
            }

            console.log('Starting AppleAuth request!')

            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: AppleAuthRequestOperation.LOGIN,
                requestedScopes: [AppleAuthRequestScope.EMAIL],
            })

            console.log('appleAuthRequestResponse', appleAuthRequestResponse)

            const { email, nonce, identityToken, user } = appleAuthRequestResponse
            const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce)

            if (!identityToken) {
                throw new Error('Apple Auth Sign in failed - no identity token returned')
            }

            // Create new platform Object
            const applePlatform = new SocialPlatform(
                'apple',
                user,
                null,
                null,
                email,
                null,
                null,
                true,
                false
            )
            console.log(applePlatform)

                // Things we get:
                // email
                // id
                // platformName

                // Things we need:
                // profileImage
                // username
                // APIToken stuff
            

            // Once we get sign in information, we should get MusicKit keys/token

            CreateDocumentAndSignIn(applePlatform, appleCredential) 
            // Sign in
            // return firebase.auth().signInWithCredential(appleCredential) 
            */

            // Call Firebase function for auth
            InitAppleMusicAuthFlow()
            // Let Firebase function do it's thing
            // We should probably prepare to handle a deep link once authed
            // Create new social platform
            // Create new user document
            // Get custom auth token
            // Sign in
        } catch (error) {
            console.warn(error)
        }
    }

    return (
        <SocialAuthButton platform={ApplePlatform} platformSignInAction={signInWithAppleAction} />
    )
}

export default AppleAuthButton
