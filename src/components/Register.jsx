const Register = () => {

    return (
        <div className="flex justify-center align-middle flex-col">
            <div className="text-[14px]">Login in Music</div>
            <div>
                <input placeholder="Email" type="text" name="email" value={Form.email} />
                <input placeholder="Password" type="password" name="password" value={Form.password} />

            </div>

        </div>
    )
}

export default Register;