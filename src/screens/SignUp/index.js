import React from 'react'
import GetMobileNumberStep from './Steps/GetMobileNumberStep'
class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mobileNumber: '',
            stepNumber: 1
        }
    }
    setMobileNumber = mobileNumber => {
        this.setState({ mobileNumber, stepNumber: 2 })
    }
    render() {
        let { stepNumber } = this.state
        switch (stepNumber) {
            case 1: {
                return <GetMobileNumberStep setMobileNumber={this.setMobileNumber} />
            }
            case 2: {
                return <GetMobileNumberStep setMobileNumber={this.setMobileNumber} />
            }
            default:
                break;
        }

    }
}
export default SignUp