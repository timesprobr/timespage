import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  Trophy, 
  FileText, 
  Trash2, 
  Edit3, 
  X, 
  PlusCircle, 
  Download, 
  FileImage, 
  Sun, 
  Moon, 
  Upload, 
  Eye, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Palette, 
  Globe, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Zap, 
  RefreshCw, 
  Target, 
  MessageSquare, 
  MessageCircle, 
  UserPlus, 
  User, 
  MousePointer2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { CLUB_CONFIG as STATIC_CONFIG } from '../config/club';

const ACTIVE_CONFIG = STATIC_CONFIG;

export default function Admin() {
