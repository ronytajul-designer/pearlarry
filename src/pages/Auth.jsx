import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { IMG } from '../images'
import { AppleMark, Checkbox, Field, GoogleMark, PasswordField } from '../components/ui'
import Icon from '../components/Icon'
import { RollText, SplitText, ease } from '../components/motion'
import { useAuth, useReady, useToast } from '../lib/store'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Split screen used by all four auth pages: same visual, same entrance. */
function AuthShell({ title, lede, children }) {
  const ready = useReady()
  return (
    <div className="auth">
      <motion.div className="auth-visual" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={ready ? { clipPath: 'inset(0 0% 0 0)' } : undefined} transition={{ duration: 1.2, ease }}>
        <motion.img src={IMG.hero} alt="" initial={{ scale: 1.25 }} animate={ready ? { scale: 1 } : undefined} transition={{ duration: 2, ease }} />
        <div className="auth-shade" />
        <Link to="/" className="auth-logo">Pearlarry</Link>
        <div className="auth-tag">
          <SplitText as="p" className="auth-tag-title" text={['Jewellery to treasure, today', 'and always.']} play={ready} delay={0.5} />
          <motion.p initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease, delay: 0.9 }}>Discover gold rings, pendants and everyday hoops.</motion.p>
        </div>
      </motion.div>
      <div className="auth-form-wrap">
        <motion.div className="auth-form" initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 0.2 }}>
          <SplitText as="h1" className="auth-title" text={title} play={ready} delay={0.3} />
          <p className="auth-lede">{lede}</p>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

function Social() {
  const toast = useToast()
  return (
    <div className="social">
      <button type="button" className="btn btn--outline btn--block" onClick={() => toast('Google sign-in connects once the backend is live')}><GoogleMark /> Continue with Google</button>
      <button type="button" className="btn btn--outline btn--block" onClick={() => toast('Apple sign-in connects once the backend is live')}><AppleMark /> Continue with Apple</button>
    </div>
  )
}

export function Login() {
  const auth = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [f, setF] = useState({ email: '', password: '', remember: true })
  const [err, setErr] = useState({})
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!EMAIL.test(f.email)) er.email = 'Enter a valid email address.'
    if (!f.password) er.password = 'Enter your password.'
    setErr(er)
    if (Object.keys(er).length) return
    auth.signIn()
    toast('Welcome back, Maya')
    navigate('/account')
  }
  return (
    <AuthShell title="Welcome back" lede="Sign in to rediscover your favourite pieces.">
      <Social />
      <p className="divider"><span>or sign in with email</span></p>
      <form className="form-stack" onSubmit={submit} noValidate>
        <Field label="Email address" type="email" autoComplete="email" placeholder="you@email.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={err.email} />
        <PasswordField label="Password" autoComplete="current-password" placeholder="••••••••" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} error={err.password} />
        <div className="auth-row">
          <Checkbox label="Remember me" checked={f.remember} onChange={(v) => setF({ ...f, remember: v })} />
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>
        <button className="btn btn--brand btn--block" type="submit"><RollText text="Sign in" /></button>
      </form>
      <p className="auth-alt">Don’t have an account? <Link to="/register" className="auth-link">Create one</Link></p>
    </AuthShell>
  )
}

export function Register() {
  const auth = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', agree: false })
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const strength = Math.min(4, [/.{8,}/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(f.password)).length)
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Enter your full name.'
    if (!EMAIL.test(f.email)) er.email = 'Enter a valid email address.'
    if (f.password.length < 8) er.password = 'Use 8 characters or more.'
    if (f.confirm !== f.password) er.confirm = 'Passwords don’t match.'
    if (!f.agree) er.agree = 'Please accept the terms to continue.'
    setErr(er)
    if (Object.keys(er).length) return
    auth.signIn()
    toast(`Welcome to Pearlarry, ${f.name.split(' ')[0]}`)
    navigate('/account')
  }
  return (
    <AuthShell title="Create your account" lede="Join Pearlarry. Find your next treasured piece.">
      <form className="form-stack" onSubmit={submit} noValidate>
        <Field label="Full name" autoComplete="name" placeholder="Maya Laurent" value={f.name} onChange={set('name')} error={err.name} />
        <Field label="Email address" type="email" autoComplete="email" placeholder="you@email.com" value={f.email} onChange={set('email')} error={err.email} />
        <div>
          <PasswordField label="Password" autoComplete="new-password" placeholder="••••••••" value={f.password} onChange={set('password')} error={err.password} />
          {f.password && (
            <div className="strength" aria-label={`Password strength ${['weak', 'weak', 'fair', 'good', 'strong'][strength]}`}>
              {[0, 1, 2, 3].map((i) => <motion.span key={i} animate={{ backgroundColor: i < strength ? ['#c0392b', '#c0392b', '#d4a017', '#3f6b3a', '#3f6b3a'][strength] : '#efe8e4' }} />)}
            </div>
          )}
        </div>
        <PasswordField label="Confirm password" autoComplete="new-password" placeholder="••••••••" value={f.confirm} onChange={set('confirm')} error={err.confirm} />
        <p className="divider"><span>or sign up with</span></p>
        <Social />
        <div>
          <Checkbox label={<>I agree to the <Link to="/terms" className="auth-inline">Terms of Service</Link> & <Link to="/privacy" className="auth-inline">Privacy Policy</Link>.</>} checked={f.agree} onChange={(v) => setF({ ...f, agree: v })} />
          {err.agree && <p className="field-error">{err.agree}</p>}
        </div>
        <button className="btn btn--brand btn--block" type="submit"><RollText text="Create account" /></button>
      </form>
      <p className="auth-alt">Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
    </AuthShell>
  )
}

export function Forgot() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!EMAIL.test(email)) return setErr('Enter a valid email address.')
    setErr('')
    setSent(true)
  }
  return (
    <AuthShell title="Reset your password" lede="Enter your email and we’ll send you a link to reset your password.">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" className="auth-sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <span className="success-icon"><Icon name="mail" size={24} /></span>
            <p>We’ve sent a reset link to <strong>{email}</strong>. It expires in 30 minutes.</p>
            <Link to="/reset-password" className="btn btn--brand btn--block"><RollText text="Open reset link" /></Link>
          </motion.div>
        ) : (
          <motion.form key="form" className="form-stack" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
            <Field label="Email address" type="email" autoComplete="email" placeholder="you@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setErr('') }} error={err} />
            <button className="btn btn--brand btn--block" type="submit"><RollText text="Send reset link" /></button>
          </motion.form>
        )}
      </AnimatePresence>
      <p className="auth-alt">Remember your password? <Link to="/login" className="auth-link">Back to sign in</Link></p>
    </AuthShell>
  )
}

export function Reset() {
  const toast = useToast()
  const navigate = useNavigate()
  const [f, setF] = useState({ password: '', confirm: '' })
  const [err, setErr] = useState({})
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.password.length < 8) er.password = 'Use 8 characters or more.'
    if (f.confirm !== f.password) er.confirm = 'Passwords don’t match.'
    setErr(er)
    if (Object.keys(er).length) return
    toast('Password updated. Sign in with your new password.')
    navigate('/login')
  }
  return (
    <AuthShell title="Create new password" lede="Your new password must be different from previously used passwords.">
      <form className="form-stack" onSubmit={submit} noValidate>
        <PasswordField label="New password" autoComplete="new-password" placeholder="••••••••" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} error={err.password} />
        <PasswordField label="Confirm new password" autoComplete="new-password" placeholder="••••••••" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} error={err.confirm} />
        <button className="btn btn--brand btn--block" type="submit"><RollText text="Reset password" /></button>
      </form>
      <p className="auth-alt">Back to <Link to="/login" className="auth-link">Sign in</Link></p>
    </AuthShell>
  )
}
