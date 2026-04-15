# VelvetHyper Phase 3: Guest Tools Makefile
# Designed for MinGW-w64 (MSYS2) on Windows

CXX = g++
CXXFLAGS = -O2 -Wall -I. -static
LDFLAGS = -lshlwapi -liphlpapi

all: sanitizer.exe verifier.exe

sanitizer.exe: sanitizer.cpp common.h
	$(CXX) $(CXXFLAGS) -o sanitizer.exe sanitizer.cpp $(LDFLAGS)

verifier.exe: verifier.cpp common.h
	$(CXX) $(CXXFLAGS) -o verifier.exe verifier.cpp $(LDFLAGS)

clean:
	rm -f *.exe *.o

.PHONY: all clean
