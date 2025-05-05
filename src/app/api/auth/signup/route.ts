// File: app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import * as z from "zod";

const prisma = new PrismaClient();

// Validation schema
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { email, password, name } = validation.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(password, 12);
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        emailVerified: null,
        credits: 100, // Default credits as per your schema
        role: "USER", // Default role as per your schema
      },
    });
    
    // Create a session
    const session = await prisma.session.create({
      data: {
        user: {
          connect: { id: user.id }
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken: crypto.randomUUID(),
      },
    });
    
    // Create JWT token (optional for additional security)
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret_change_this",
      { expiresIn: "30d" }
    );
    
    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session-token",
      value: session.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
    
    // Return user data (excluding sensitive information)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
      },
    });
    
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}