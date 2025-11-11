# 🎨 06. Frontend Overview - Giao diện Frontend

## 6.1 Tổng quan Frontend

**Framework**: React 18.2.0  
**Build Tool**: Vite 5.0.8  
**Styling**: Tailwind CSS 3.3.6  
**Animation**: Framer Motion 10.16.16  
**Routing**: React Router DOM 6.20.0  
**Icons**: Lucide React 0.294.0  
**Date Utilities**: date-fns 3.0.0

---

## 6.2 Design System

### Color Palette (Pastel Theme)

```css
/* Primary Colors */
--pink: #FFD6E8;        /* Pastel pink - Main accent */
--purple: #E6D5F7;      /* Pastel purple - Secondary */
--mint: #C8F4E3;        /* Pastel mint - Success/Fresh */
--yellow: #FFF4C9;      /* Pastel yellow - Warning/Info */

/* Gradients */
--gradient-pink: linear-gradient(135deg, #FFD6E8 0%, #FFC4DD 100%);
--gradient-purple: linear-gradient(135deg, #E6D5F7 0%, #D4C5E8 100%);
--gradient-mint: linear-gradient(135deg, #C8F4E3 0%, #B5E8D4 100%);

/* Neutral Colors */
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #E5E5E5;
--gray-600: #525252;
--gray-900: #171717;

/* Semantic Colors */
--success: #22C55E;
--error: #EF4444;
--warning: #F59E0B;
--info: #3B82F6;
```

### Typography

```css
/* Font Families */
--font-primary: 'Nunito', sans-serif;     /* Body text */
--font-heading: 'Poppins', sans-serif;    /* Headings */

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

```css
/* Tailwind Spacing (4px base unit) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-3xl: 2rem;      /* 32px */
--radius-full: 9999px;   /* Circle */
```

---

## 6.3 Pages Overview

### 🏠 Home Page (`Home.jsx`)

**Route**: `/`  
**Purpose**: Landing page với overview của 4 công cụ chính

**Features**:
- Hero section với welcome message
- Grid layout 4 tool cards
- Smooth fade-in animations
- Click card → navigate to tool

**Key Components**:
```jsx
<Home>
  <Hero>
    <Title>Welcome Ka & Dong 💕</Title>
    <Subtitle>Personal Utilities for Our Daily Life</Subtitle>
  </Hero>
  
  <ToolGrid>
    <ToolCard tool="notes" />
    <ToolCard tool="countdown" />
    <ToolCard tool="calendar" />
    <ToolCard tool="currency" />
  </ToolGrid>
</Home>
```

**Animations**:
- Page fade-in: 0.5s ease
- Cards stagger: 0.1s delay each
- Hover scale: 1.05x

---

### 📝 Notes Tool (`NotesTool.jsx`)

**Route**: `/notes`  
**Purpose**: Quản lý ghi chú cá nhân với color coding

**Features**:
- ✅ Create, read, update, delete notes
- ✅ Color-coded notes (pink, purple, mint, yellow)
- ✅ Pin important notes to top
- ✅ Search notes by title/content
- ✅ Sort by date (newest/oldest)
- ✅ Character counter
- ✅ Auto-save drafts to localStorage

**UI Components**:
```jsx
<NotesTool>
  <Header>
    <SearchBar />
    <FilterButtons />
    <NewNoteButton />
  </Header>
  
  <NotesGrid>
    {/* Pinned notes first */}
    {pinnedNotes.map(note => (
      <NoteCard key={note.id} {...note} isPinned />
    ))}
    
    {/* Regular notes */}
    {regularNotes.map(note => (
      <NoteCard key={note.id} {...note} />
    ))}
  </NotesGrid>
  
  <NoteModal>
    <NoteForm />
  </NoteModal>
</NotesTool>
```

**NoteCard Component**:
```jsx
<motion.div className={`note-card bg-${color}`}>
  <PinButton />
  <Title>{title}</Title>
  <Content>{content}</Content>
  <Footer>
    <Timestamp>{formatDate(created_at)}</Timestamp>
    <Actions>
      <EditButton />
      <DeleteButton />
    </Actions>
  </Footer>
</motion.div>
```

**State Management**:
```javascript
const [notes, setNotes] = useState([])
const [searchQuery, setSearchQuery] = useState('')
const [selectedColor, setSelectedColor] = useState('all')
const [isModalOpen, setIsModalOpen] = useState(false)
const [editingNote, setEditingNote] = useState(null)
```

---

### ⏱️ Countdown Tool (`CountdownTool.jsx`)

**Route**: `/countdown`  
**Purpose**: Đếm ngược đến các sự kiện quan trọng

**Features**:
- ✅ Add countdown events (name, date, description)
- ✅ Real-time countdown display (days, hours, minutes, seconds)
- ✅ Past events display as "memories"
- ✅ Color themes for events
- ✅ Edit/delete events
- ✅ Auto-refresh every second

**UI Layout**:
```jsx
<CountdownTool>
  <Header>
    <Title>Countdown Events ⏱️</Title>
    <AddEventButton />
  </Header>
  
  <UpcomingEvents>
    {upcomingEvents.map(event => (
      <EventCard key={event.id}>
        <EventTitle>{event.title}</EventTitle>
        <Countdown>
          <TimeUnit>
            <Number>{days}</Number>
            <Label>days</Label>
          </TimeUnit>
          <TimeUnit>
            <Number>{hours}</Number>
            <Label>hours</Label>
          </TimeUnit>
          <TimeUnit>
            <Number>{minutes}</Number>
            <Label>mins</Label>
          </TimeUnit>
          <TimeUnit>
            <Number>{seconds}</Number>
            <Label>secs</Label>
          </TimeUnit>
        </Countdown>
        <TargetDate>{formatDate(target_date)}</TargetDate>
      </EventCard>
    ))}
  </UpcomingEvents>
  
  <PastEvents>
    <Subtitle>Memories 💭</Subtitle>
    {pastEvents.map(event => (
      <MemoryCard key={event.id} />
    ))}
  </PastEvents>
</CountdownTool>
```

**Countdown Logic**:
```javascript
const calculateTimeRemaining = (targetDate) => {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target - now
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

useEffect(() => {
  const interval = setInterval(() => {
    // Update countdown every second
    setTimeRemaining(calculateTimeRemaining(event.target_date))
  }, 1000)
  
  return () => clearInterval(interval)
}, [event.target_date])
```

---

### 📅 Calendar Tool (`CalendarTool.jsx`)

**Route**: `/calendar`  
**Purpose**: Xem lịch và ghi chú theo ngày

**Features**:
- ✅ Month view calendar
- ✅ Navigate previous/next month
- ✅ Highlight today
- ✅ Add notes to specific dates
- ✅ View notes for selected date
- ✅ Event markers on calendar

**UI Structure**:
```jsx
<CalendarTool>
  <CalendarHeader>
    <PrevButton />
    <MonthYear>November 2024</MonthYear>
    <NextButton />
  </CalendarHeader>
  
  <CalendarGrid>
    <WeekdayHeader>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <WeekdayCell key={day}>{day}</WeekdayCell>
      ))}
    </WeekdayHeader>
    
    <DaysGrid>
      {daysInMonth.map(day => (
        <DayCell 
          key={day}
          isToday={isToday(day)}
          hasEvents={hasEvents(day)}
          onClick={() => selectDate(day)}
        >
          {day.getDate()}
          {hasEvents(day) && <EventDot />}
        </DayCell>
      ))}
    </DaysGrid>
  </CalendarGrid>
  
  <SelectedDatePanel>
    <DateTitle>{formatDate(selectedDate)}</DateTitle>
    <EventsList>
      {eventsForDate.map(event => (
        <EventItem key={event.id} />
      ))}
    </EventsList>
    <AddEventButton />
  </SelectedDatePanel>
</CalendarTool>
```

**Calendar State**:
```javascript
const [currentMonth, setCurrentMonth] = useState(new Date())
const [selectedDate, setSelectedDate] = useState(new Date())
const [events, setEvents] = useState([])

const daysInMonth = useMemo(() => {
  return getDaysInMonth(currentMonth)
}, [currentMonth])

const eventsForDate = useMemo(() => {
  return events.filter(event => 
    isSameDay(new Date(event.target_date), selectedDate)
  )
}, [events, selectedDate])
```

---

### 💱 Currency Tool (`CurrencyTool.jsx`)

**Route**: `/currency`  
**Purpose**: Chuyển đổi tiền tệ với tỷ giá real-time

**Features**:
- ✅ Convert between multiple currencies
- ✅ Live exchange rates
- ✅ Swap from/to currencies
- ✅ Calculation history
- ✅ Popular currency pairs
- ✅ Last updated timestamp

**UI Layout**:
```jsx
<CurrencyTool>
  <Header>
    <Title>Currency Converter 💱</Title>
    <LastUpdated>Updated: {formatTime(lastUpdate)}</LastUpdated>
  </Header>
  
  <ConverterCard>
    <FromSection>
      <Label>From</Label>
      <AmountInput 
        value={amount}
        onChange={setAmount}
        type="number"
      />
      <CurrencySelect 
        value={fromCurrency}
        onChange={setFromCurrency}
        options={currencies}
      />
    </FromSection>
    
    <SwapButton onClick={swapCurrencies}>
      ⇄
    </SwapButton>
    
    <ToSection>
      <Label>To</Label>
      <ResultDisplay>{convertedAmount}</ResultDisplay>
      <CurrencySelect 
        value={toCurrency}
        onChange={setToCurrency}
        options={currencies}
      />
    </ToSection>
    
    <ExchangeRate>
      1 {fromCurrency} = {rate} {toCurrency}
    </ExchangeRate>
  </ConverterCard>
  
  <PopularPairs>
    <Subtitle>Popular Pairs</Subtitle>
    <PairsList>
      <PairCard pair="USD/VND" />
      <PairCard pair="USD/EUR" />
      <PairCard pair="USD/JPY" />
    </PairsList>
  </PopularPairs>
  
  <HistoryPanel>
    <Subtitle>Recent Conversions</Subtitle>
    {history.map((item, i) => (
      <HistoryItem key={i}>
        {item.amount} {item.from} → {item.result} {item.to}
      </HistoryItem>
    ))}
  </HistoryPanel>
</CurrencyTool>
```

**Conversion Logic**:
```javascript
const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  // Convert to base currency (USD)
  const amountInUSD = amount / rates[fromCurrency]
  
  // Convert to target currency
  const result = amountInUSD * rates[toCurrency]
  
  return result.toFixed(2)
}

const [amount, setAmount] = useState(1)
const [fromCurrency, setFromCurrency] = useState('USD')
const [toCurrency, setToCurrency] = useState('VND')
const [rates, setRates] = useState({})

const convertedAmount = useMemo(() => {
  return convertCurrency(amount, fromCurrency, toCurrency, rates)
}, [amount, fromCurrency, toCurrency, rates])
```

---

## 6.4 Shared Components

### 🧭 Header (`Header.jsx`)

**Location**: `src/components/Header.jsx`  
**Purpose**: Top navigation bar

**Features**:
- Logo/Brand name
- User profile dropdown
- Logout button
- Responsive hamburger menu (mobile)

```jsx
<Header>
  <Container>
    <Logo>
      <Link to="/">KaDong Tools 💕</Link>
    </Logo>
    
    <Nav>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/notes">Notes</NavLink>
        <NavLink to="/countdown">Countdown</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/currency">Currency</NavLink>
      </NavLinks>
      
      <UserMenu>
        <Avatar>{user.username[0]}</Avatar>
        <Dropdown>
          <DropdownItem>Profile</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem onClick={logout}>Logout</DropdownItem>
        </Dropdown>
      </UserMenu>
    </Nav>
  </Container>
</Header>
```

---

### 🎯 SidebarMenu (`SidebarMenu.jsx`)

**Location**: `src/components/SidebarMenu.jsx`  
**Purpose**: Left sidebar navigation

**Features**:
- Tool icons with labels
- Active route highlighting
- Collapse/expand functionality
- Quick access links

```jsx
<Sidebar isExpanded={isExpanded}>
  <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
    {isExpanded ? '<' : '>'}
  </ToggleButton>
  
  <MenuItems>
    <MenuItem to="/" icon={<Home />} label="Home" />
    <MenuItem to="/notes" icon={<StickyNote />} label="Notes" />
    <MenuItem to="/countdown" icon={<Clock />} label="Countdown" />
    <MenuItem to="/calendar" icon={<Calendar />} label="Calendar" />
    <MenuItem to="/currency" icon={<DollarSign />} label="Currency" />
  </MenuItems>
  
  <Footer>
    <MenuItem to="/feedback" icon={<MessageSquare />} label="Feedback" />
    <MenuItem to="/settings" icon={<Settings />} label="Settings" />
  </Footer>
</Sidebar>
```

---

### 🃏 ToolCard (`ToolCard.jsx`)

**Location**: `src/components/ToolCard.jsx`  
**Purpose**: Reusable card component for displaying tools

**Props**:
```typescript
interface ToolCardProps {
  title: string
  description: string
  icon: ReactNode
  color: 'pink' | 'purple' | 'mint' | 'yellow'
  onClick: () => void
}
```

**Component**:
```jsx
const ToolCard = ({ title, description, icon, color, onClick }) => {
  return (
    <motion.div
      className={`tool-card bg-gradient-to-br from-${color}-200 to-${color}-300`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <IconWrapper className={`text-${color}-600`}>
        {icon}
      </IconWrapper>
      
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
      
      <ArrowIcon>→</ArrowIcon>
    </motion.div>
  )
}
```

**Usage Example**:
```jsx
<ToolCard
  title="Notes Tool"
  description="Manage your personal notes"
  icon={<StickyNote size={32} />}
  color="pink"
  onClick={() => navigate('/notes')}
/>
```

---

### 🦶 Footer (`Footer.jsx`)

**Location**: `src/components/Footer.jsx`  
**Purpose**: Bottom footer with links

```jsx
<Footer>
  <Container>
    <Copyright>
      © 2024 KaDong Tools. Made with 💕
    </Copyright>
    
    <Links>
      <Link to="/about">About</Link>
      <Link to="/privacy">Privacy</Link>
      <Link to="/terms">Terms</Link>
    </Links>
    
    <Social>
      <SocialLink href="https://github.com/...">GitHub</SocialLink>
      <SocialLink href="https://twitter.com/...">Twitter</SocialLink>
    </Social>
  </Container>
</Footer>
```

---

## 6.5 Animation Patterns

### Page Transitions

```jsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const pageTransition = {
  duration: 0.3,
  ease: 'easeInOut'
}

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={pageTransition}
>
  {/* Page content */}
</motion.div>
```

### Stagger Children

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects

```jsx
<motion.button
  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Click Me
</motion.button>
```

---

## 6.6 Responsive Design

### Breakpoints

```javascript
const breakpoints = {
  xs: '320px',   // Mobile small
  sm: '640px',   // Mobile large
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop large
  '2xl': '1536px' // Desktop extra large
}
```

### Mobile-First Approach

```jsx
// Tailwind classes (mobile-first)
<div className="
  grid 
  grid-cols-1        /* Mobile: 1 column */
  sm:grid-cols-2     /* Tablet: 2 columns */
  lg:grid-cols-4     /* Desktop: 4 columns */
  gap-4
">
  {/* Content */}
</div>
```

### Responsive Typography

```jsx
<h1 className="
  text-2xl          /* Mobile: 24px */
  sm:text-3xl       /* Tablet: 30px */
  lg:text-4xl       /* Desktop: 36px */
  font-bold
">
  Heading
</h1>
```

---

## 6.7 Adding a New Tool

**Steps to add a new tool page**:

### 1. Create Page Component

```jsx
// src/pages/NewTool.jsx
import { motion } from 'framer-motion'

const NewTool = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1>New Tool</h1>
      {/* Tool content */}
    </motion.div>
  )
}

export default NewTool
```

### 2. Add Route

```jsx
// src/App.jsx
import NewTool from './pages/NewTool'

<Routes>
  {/* Existing routes */}
  <Route path="/new-tool" element={<NewTool />} />
</Routes>
```

### 3. Add Navigation

```jsx
// src/components/SidebarMenu.jsx
<MenuItem 
  to="/new-tool" 
  icon={<YourIcon />} 
  label="New Tool" 
/>
```

### 4. Add to Home Grid

```jsx
// src/pages/Home.jsx
<ToolCard
  title="New Tool"
  description="Description of new tool"
  icon={<YourIcon />}
  color="purple"
  onClick={() => navigate('/new-tool')}
/>
```

### 5. Update Tools API

```sql
-- Database: Add to tools table
INSERT INTO tools (name, display_name, description, icon, is_active)
VALUES ('newtool', 'New Tool', 'Description', 'YourIcon', true);
```

---

## 📎 Related Links

- **[Project Structure](02_ProjectStructure.md)** - Frontend file structure
- **[API Documentation](05_API_Documentation.md)** - Backend API integration
- **[Setup Guide](03_SetupAndInstallation.md)** - Run frontend dev server
- **[Contribution Guide](08_ContributionGuide.md)** - Add new features

---

**Version**: 1.0  
**Last Updated**: November 11, 2024  
**Author**: KaDong Team
